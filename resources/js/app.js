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

const canvas = new fabric.Canvas("whiteboard", properties);

function get(id) {
    return document.getElementById(id);
}

const tools = {
    select: get("selection-tool"),
    pencil: get("pencil-tool"),
    draw: get("draw-tool"),
    fill: get("fill-tool"),
    eraser: get("eraser-tool"),
    text: get("text-tool"),
    shapes: get("shapes-tool"),
    crop: get("crop-tool"),
    filter: get("filter-tool"),
};
