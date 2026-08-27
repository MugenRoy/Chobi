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
