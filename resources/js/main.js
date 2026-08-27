let undoStack = [];
let redoStack = [];

let activeTool = "selection";

let isRestoringState = false;

function selectionTool() {
    canvas.isDrawingMode = false;
    canvas.selection = true;

    activeTool = "selection";


    tools.select.classList.add("tool-active");
    tools.draw.classList.remove("tool-active");

}

function drawTool() {
    canvas.isDrawingMode = true;
    activeTool = "draw";

    tools.draw.classList.add("tool-active");
    tools.select.classList.remove("tool-active");

    canvas.discardActiveObject();
    canvas.renderAll();
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
