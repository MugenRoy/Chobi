let activeTool = "selection";


function selectionTool() {
    canvas.isDrawingMode = false;
    canvas.selection = true;

    tools.select.style.borderBottom = "1px solid var(--primary-color)";
    tools.select.style.borderLeft = "1px solid var(--primary-color)";
    tools.select.style.borderTop = "1px solid var(--primary-color)";

    for (const [name, element] of Object.entries(tools)) {
        if (name === "select") {
            continue;
        }
        element.style.border = "none";
    }
    activeTool = "selection";
}


const strokeColor = get("stroke-color");
const strokeSize = get("stroke-size");
function pencilTool() {
    canvas.isDrawingMode = true;
    canvas.selection = false;

    tools.pencil.style.borderBottom = "1px solid var(--primary-color)";
    tools.pencil.style.borderLeft = "1px solid var(--primary-color)";
    tools.pencil.style.borderTop = "1px solid var(--primary-color)";

    for (const [name, element] of Object.entries(tools)) {
        if (name === "pencil") {
            continue;
        }
        element.style.border = "none";
    }

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = strokeColor.value;
    canvas.freeDrawingBrush.width = parseInt(strokeSize.value, 10) || 5;
    activeTool = "pencil";
}

strokeColor.onchange = () => {
    if (activeTool != "pencil") {
        return;
    }
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor.value;
    }
};

strokeSize.onchange = () => {
    if (activeTool != "pencil") {
        return;
    }
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = parseInt(strokeSize.value, 10) || 1;
    }
};


const brushColor = get("brush-color");
const brushSize = get("brush-size");
const brushType = get("brush-type");
function drawTool() {
    canvas.isDrawingMode = true;
    canvas.selection = false;

    tools.draw.style.borderBottom = "1px solid var(--primary-color)";
    tools.draw.style.borderLeft = "1px solid var(--primary-color)";
    tools.draw.style.borderTop = "1px solid var(--primary-color)";
    for (const [name, element] of Object.entries(tools)) {
        if (name === "draw") {
            continue;
        }
        element.style.border = "none";
    }
    activeTool = "draw";
    if (brushType.value == "Bubble") {
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
    }
    else {
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    }
    canvas.freeDrawingBrush.color = brushColor.value;
    canvas.freeDrawingBrush.width = parseInt(brushSize.value, 10) || 5;
}

brushColor.onchange = () => {
    if (activeTool != "draw") {
        return;
    }
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = brushColor.value;
    }
};

brushSize.onchange = () => {
    if (activeTool != "draw") {
        return;
    }
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = parseInt(brushSize.value, 10) || 1;
    }
};

brushType.onchange = () => {
    if (activeTool != "draw") {
        return;
    }
    if (brushType.value == "Bubble") {
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
    }
    else {
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    }
    canvas.freeDrawingBrush.color = brushColor.value;
    canvas.freeDrawingBrush.width = parseInt(brushSize.value, 10) || 5;
};



function fillTool() {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    tools.fill.style.borderBottom = "1px solid var(--primary-color)";
    tools.fill.style.borderLeft = "1px solid var(--primary-color)";
    tools.fill.style.borderTop = "1px solid var(--primary-color)";
    for (const [name, element] of Object.entries(tools)) {
        if (name === "fill") {
            continue;
        }
        element.style.border = "none";
    }
    activeTool = "fill";
}

const fillColor = get("fill-color");
canvas.on("mouse:down", (options) => {
    if (activeTool != "fill") {
        return;
    }
    const selectedColor = fillColor.value;

    if (options.target) {
        options.target.set("fill", selectedColor);
    } else {
        canvas.backgroundColor = selectedColor;
    }
    canvas.requestRenderAll();
});


const eraserSize = get("eraser-size");
function eraserTool() {
    canvas.isDrawingMode = true;
    canvas.selection = false;

    tools.eraser.style.borderBottom = "1px solid var(--primary-color)";
    tools.eraser.style.borderLeft = "1px solid var(--primary-color)";
    tools.eraser.style.borderTop = "1px solid var(--primary-color)";
    for (const [name, element] of Object.entries(tools)) {
        if (name === "eraser") {
            continue;
        }
        element.style.border = "none";
    }
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "#ffffff";
    canvas.freeDrawingBrush.width = parseInt(eraserSize.value, 10) || 5;
    activeTool = "eraser";
}

eraserSize.onchange = () => {
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = parseInt(eraserSize.value, 10) || 1;
    }
};


const textSize = get("text-size");
const bgColor = get("bg-color");
const textColor = get("text-color");
const textAlign = get("text-align");
function textTool() {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    tools.text.style.borderBottom = "1px solid var(--primary-color)";
    tools.text.style.borderLeft = "1px solid var(--primary-color)";
    tools.text.style.borderTop = "1px solid var(--primary-color)";
    for (const [name, element] of Object.entries(tools)) {
        if (name === "text") {
            continue;
        }
        element.style.border = "none";
    }
    activeTool = "textbox";
}

function addText() {
    let editableText = new fabric.Textbox('Edit Text', {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fontFamily: "Arial",
        fontSize: textSize.value,
        fill: textColor.value,
        minScaleLimit: 0.2,
        textAlign: textAlign.value,
        textBackgroundColor: bgColor.value
    });
    canvas.add(editableText);
}


const shapeType = get("shape-type");
const shapeFill = get("shape-fill");
const shapeStroke = get("shape-stroke");
const shapeStrokeWidth = get("shape-stroke-width");
function shapesTool() {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    tools.shapes.style.borderBottom = "1px solid var(--primary-color)";
    tools.shapes.style.borderLeft = "1px solid var(--primary-color)";
    tools.shapes.style.borderTop = "1px solid var(--primary-color)";
    for (const [name, element] of Object.entries(tools)) {
        if (name === "shapes") {
            continue;
        }
        element.style.border = "none";
    }
    activeTool = "shapes";
}

function addShape() {
    let shape;
    switch (shapeType.value) {
        case 'rect': {
            shape = new fabric.Rect({
                left: canvas.width / 2,
                top: canvas.height / 2,
                fill: shapeFill.value,
                stroke: shapeStroke.value,
                strokeWidth: parseInt(shapeStrokeWidth.value, 10) || 0,
                width: 120,
                height: 80
            });
            break;
        }
        case 'circle': {
            shape = new fabric.Circle({
                left: canvas.width / 2,
                top: canvas.height / 2,
                fill: shapeFill.value,
                stroke: shapeStroke.value,
                strokeWidth: parseInt(shapeStrokeWidth.value, 10) || 0,
                radius: 50
            });
            break;
        }
        case 'triangle': {
            shape = new fabric.Triangle({
                left: canvas.width / 2,
                top: canvas.height / 2,
                fill: shapeFill.value,
                stroke: shapeStroke.value,
                strokeWidth: parseInt(shapeStrokeWidth.value, 10) || 0,
                width: 100,
                height: 100
            });
            break;
        }
    }
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.requestRenderAll();
}

let cropRect = null;
function cropTool() {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    tools.crop.style.borderBottom = "1px solid var(--primary-color)";
    tools.crop.style.borderLeft = "1px solid var(--primary-color)";
    tools.crop.style.borderTop = "1px solid var(--primary-color)";
    for (const [name, element] of Object.entries(tools)) {
        if (name === "crop") {
            continue;
        }
        element.style.border = "none";
    }
    activeTool = "crop";

    if (cropRect) {
        canvas.remove(cropRect);
    }
    cropRect = new fabric.Rect({
            left: canvas.width / 2,
            top: canvas.height / 2,
            width: canvas.width * 0.5,
            height: canvas.height * 0.5,
            fill: "transparent",
            stroke: "#000000",
            strokeWidth: 2,
            strokeDashArray: [10, 5],
            transparentCorners: false,
            hasRotatingPoint: true
        });

    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.requestRenderAll();
}

function cancelCrop() {
    if (cropRect) {
        canvas.remove(cropRect);
        cropRect = null;
        canvas.requestRenderAll();
    }
    selectionTool();
}


function filterTool() {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    tools.filter.style.borderBottom = "1px solid var(--primary-color)";
    tools.filter.style.borderLeft = "1px solid var(--primary-color)";
    tools.filter.style.borderTop = "1px solid var(--primary-color)";
    for (const [name, element] of Object.entries(tools)) {
        if (name === "filter") {
            continue;
        }
        element.style.border = "none";
    }
    activeTool = "filter";
}


function deleteSelected() {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length < 1) {
        return;
    }
    for (const object of activeObjects) {
        switch (object.type) {
            case 'textbox': {
                if (object.isEditing)
                {
                    break;
                }
                canvas.discardActiveObject();
                canvas.remove(object);
                break;
            }
            default: {
                canvas.discardActiveObject();
                canvas.remove(object);
                break;
            }
        }
    }
    canvas.requestRenderAll();
}


document.addEventListener("keydown", (event) => {
    if (event.code == "Delete") {
        deleteSelected();
    }
    else if (event.code == "KeyD" && event.ctrlKey) {
        // duplicateSelected(); -> Implement later
    }
    else if (event.code == "KeyZ" && event.ctrlKey) {

    }
    else if (event.code == "KeyY" && event.ctrlKey) {

    }
});


const canvas_bg = get("canvas-bg");
canvas_bg.onchange = () => {
    canvas.backgroundColor = canvas_bg.value;
    canvas.requestRenderAll();
};


function clearCanvas() {
    canvas_bg.value = "#FFFFFF";
    canvas.clear();
}
