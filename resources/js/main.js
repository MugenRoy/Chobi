function selectionTool() {
    canvas.isDrawingMode = false;
    canvas.selection = true;
}

function drawTool() {
    canvas.isDrawingMode = true;
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
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    switch (event.code) {
        case "Delete": {
            deleteSelected();
            break;
        }
        case isCtrlOrCmd && event.code === "KeyD": {
            event.preventDefault();
            console.log("Test");
            break;
        }
        default: {
            break;
        }
    }
});
