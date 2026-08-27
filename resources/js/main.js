function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

const properties = {
    width: window.innerWidth * 0.65,
    height: window.innerHeight * 0.75,
    isDrawingMode: false
};

const canvas = new fabric.Canvas("photo-area", properties);

let undoStack = [];
let redoStack = [];

let activeTool = "selection";

let isRestoringState = false;

function selectionTool() {
    canvas.isDrawingMode = false;
    activeTool = "selection";

    const selection = document.getElementById("selection-tool");
    const draw = document.getElementById("draw-tool");

    selection.classList.add("tool-active");
    draw.classList.remove("tool-active");

    canvas.selection = true;
}

function drawTool() {
    canvas.isDrawingMode = true;
    activeTool = "draw";

    const selection = document.getElementById("selection-tool");
    const draw = document.getElementById("draw-tool");

    draw.classList.add("tool-active");
    selection.classList.remove("tool-active");

    canvas.discardActiveObject();
    canvas.renderAll();
}

let lineStartPoint = null;
let activeLine = null;

function lineTool() {

    activeTool = "line";

    canvas.isDrawingMode = false;
    canvas.selection = false;

    canvas.discardActiveObject();
    canvas.renderAll();

    const selection = document.getElementById("selection-tool");
    const draw = document.getElementById("draw-tool");
    const line = document.getElementById("line-tool");
    const text = document.getElementById("text-tool");

    selection.classList.remove("tool-active");
    draw.classList.remove("tool-active");
    line.classList.add("tool-active");
    text.classList.remove("tool-active");

    canvas.defaultCursor = "crosshair";

    canvas.off("mouse:down", startLine);
    canvas.off("mouse:move", drawLine);
    canvas.off("mouse:up", finishLine);

    canvas.on("mouse:down", startLine);
    canvas.on("mouse:move", drawLine);
    canvas.on("mouse:up", finishLine);
}


function startLine(event) {

    if (activeTool !== "line") {
        return;
    }

    const pointer = canvas.getPointer(event.e);

    lineStartPoint = {
        x: pointer.x,
        y: pointer.y
    };

    activeLine = new fabric.Line(
        [
            pointer.x,
            pointer.y,
            pointer.x,
            pointer.y
        ],
        {
            stroke: "#000000",
            strokeWidth: 2,
            selectable: false,
            evented: false
        }
    );

    canvas.add(activeLine);
}


function drawLine(event) {

    if (
        activeTool !== "line" ||
        !activeLine ||
        !lineStartPoint
    ) {
        return;
    }

    const pointer = canvas.getPointer(event.e);

    activeLine.set({
        x2: pointer.x,
        y2: pointer.y
    });

    canvas.renderAll();
}


function finishLine(event) {

    if (
        activeTool !== "line" ||
        !activeLine
    ) {
        return;
    }

    activeLine.set({
        selectable: true,
        evented: true
    });

    canvas.setActiveObject(activeLine);

    activeLine = null;
    lineStartPoint = null;

    canvas.renderAll();

    saveCanvasState();
}

function textTool() {

    activeTool = "text";

    canvas.isDrawingMode = false;
    canvas.selection = false;

    canvas.discardActiveObject();
    canvas.renderAll();

    const selection = document.getElementById("selection-tool");
    const draw = document.getElementById("draw-tool");
    const line = document.getElementById("line-tool");
    const text = document.getElementById("text-tool");

    selection.classList.remove("tool-active");
    draw.classList.remove("tool-active");
    line.classList.remove("tool-active");
    text.classList.add("tool-active");

    canvas.defaultCursor = "text";

    canvas.off("mouse:down", addText);
    canvas.on("mouse:down", addText);
}


function addText(event) {

    if (activeTool !== "text") {
        return;
    }

    const pointer = canvas.getPointer(event.e);

    const textObject = new fabric.IText(
        "Text",
        {
            left: pointer.x,
            top: pointer.y,

            fill: "#000000",

            fontSize: 24,

            fontFamily: "Arial",

            editable: true,

            selectable: true
        }
    );

    canvas.add(textObject);

    canvas.setActiveObject(textObject);

    textObject.enterEditing();
    textObject.selectAll();

    canvas.renderAll();

    saveCanvasState();
}

function getCanvasState() {
    return JSON.stringify(canvas.toJSON());
}


function saveCanvasState() {
    if (isRestoringState) {
        return;
    }

    const currentState = getCanvasState();

    if (
        undoStack.length > 0 &&
        undoStack[undoStack.length - 1] === currentState
    ) {
        return;
    }

    undoStack.push(currentState);

    if (undoStack.length > 50) {
        undoStack.shift();
    }

    redoStack = [];
}

function undoTool() {

    if (undoStack.length <= 1) {
        return;
    }

    const currentState = undoStack.pop();

    redoStack.push(currentState);

    const previousState =
        undoStack[undoStack.length - 1];

    isRestoringState = true;

    canvas.loadFromJSON(previousState, function () {

        canvas.renderAll();

        isRestoringState = false;
    });
}

function redoTool() {

    if (redoStack.length === 0) {
        return;
    }

    // Get next state
    const nextState = redoStack.pop();

    // Add it back to undo history
    undoStack.push(nextState);

    isRestoringState = true;

    canvas.loadFromJSON(nextState, function () {

        canvas.renderAll();

        isRestoringState = false;
    });
}

function bringForwardTool() {

    if (activeTool !== "selection") {
        return;
    }

    const activeObject = canvas.getActiveObject();

    if (!activeObject) {
        return;
    }

    canvas.bringForward(activeObject);

    canvas.renderAll();

    saveCanvasState();
}


function sendBackwardTool() {

    if (activeTool !== "selection") {
        return;
    }

    const activeObject = canvas.getActiveObject();

    if (!activeObject) {
        return;
    }

    canvas.sendBackwards(activeObject);

    canvas.renderAll();

    saveCanvasState();
}

canvas.on("object:added", function () {

    if (isRestoringState) {
        return;
    }

    saveCanvasState();
});


canvas.on("object:modified", function () {

    if (isRestoringState) {
        return;
    }

    saveCanvasState();
});


canvas.on("object:removed", function () {

    if (isRestoringState) {
        return;
    }

    saveCanvasState();
});

document.addEventListener("keydown", async function(event) {
    const activeObject = canvas.getActiveObject();

    if (event.ctrlKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoTool();
        return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redoTool();
        return;
    }

    if (activeTool === "selection" && activeObject) {

        if (event.key === "Delete") {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.renderAll();
            return;
        }

        if (event.ctrlKey && event.key.toLowerCase() === "d") {
            event.preventDefault();

            const cloned = await activeObject.clone();

            cloned.set({
                left: activeObject.left + 10,
                top: activeObject.top + 10
            });

            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();

            return;
        }
    }
});

undoStack.push(getCanvasState());