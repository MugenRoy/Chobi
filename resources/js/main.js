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


// SR: Functionality from here
function selectionTool() {
    canvas.isDrawingMode = false;
    const select = document.getElementById("selection-tool");
    select.classList.add("tool-active");
}

function drawTool() {
    canvas.isDrawingMode = true;
    const draw = document.getElementById("draw-tool");
    draw.classList.add("tool-active");
}
