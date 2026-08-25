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

    if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }

    canvas.freeDrawingBrush.color = "#000000";
    canvas.freeDrawingBrush.width = 2;
    
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

async function undoTool() {

    if (undoStack.length <= 1) {
        return;
    }

    const currentState = undoStack.pop();

    redoStack.push(currentState);

    const previousState =
        undoStack[undoStack.length - 1];

    isRestoringState = true;

    try {
        await canvas.loadFromJSON(previousState);
        canvas.renderAll();
    } finally {
        isRestoringState = false;
    }
}

async function redoTool() {

    if (redoStack.length === 0) {
        return;
    }

    const nextState = redoStack.pop();

    undoStack.push(nextState);

    isRestoringState = true;

    try {
        await canvas.loadFromJSON(nextState);
        canvas.renderAll();
    } finally {
        isRestoringState = false;
    }
}

function bringForwardTool() {

    if (activeTool !== "selection") {
        return;
    }

    const activeObject = canvas.getActiveObject();

    if (!activeObject) {
        return;
    }

    canvas.bringObjectForward(activeObject);

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

    canvas.sendObjectBackwards(activeObject);

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

const importButton = document.getElementById("import-button");
const imageInput = document.getElementById("image-input");

importButton.addEventListener("click", function () {
    imageInput.click();
});

imageInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {

        const imageData = e.target.result;

        try {
            const img = await fabric.Image.fromURL(imageData);

            if (!img) {
                console.error("Failed to load image.");
                return;
            }

            img.set({
                left: 100,
                top: 100
            });

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        } catch (error) {
            console.error("Failed to load image.", error);
        }
    };

    reader.onerror = function () {
        console.error("Failed to read image file.");
    };

    reader.readAsDataURL(file);

    imageInput.value = "";
});

function exportTool() {
    const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "chobi-image.png";
    link.click();
}

const newCanvasButton =
    document.getElementById("new-canvas-button");

newCanvasButton.addEventListener("click", function () {

    canvas.discardActiveObject();
    canvas.clear();

    canvas.renderAll();

    undoStack = [];
    redoStack = [];

    undoStack.push(getCanvasState());
});
