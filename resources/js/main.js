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
}

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

function addText() {
    let editableText = new fabric.Textbox('Edit Text', {
        left: canvas.width / 2,
        top: canvas.height / 2,
        centerTransform: true,
        fontFamily: "Arial",
        fontSize: "24",
        fill: "#000",
        originX: 'center',
        originY: 'center',
        minScaleLimit: 0.2,
        textAlign : 'center',
    });
    canvas.add(editableText);
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
