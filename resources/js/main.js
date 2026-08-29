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
}

strokeColor.onchange = () => {
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor.value;
    }
};

strokeSize.onchange = () => {
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = parseInt(strokeSize.value, 10) || 1;
    }
};


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
}


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
}


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
}

const textSize = get("text-size");
const bgColor = get("bg-color");
const textColor = get("text-color");
const textAlign = get("text-align");
function addText() {
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
}


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
