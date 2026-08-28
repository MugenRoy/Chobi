function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

function get(id) {
    return document.getElementById(id);
}

function createImage() {
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    header.style.display = "flex";
    main.style.display = "flex";
    const setup = get("setup");
    setup.style.display = "none";
}

const cproperties = {
    width: window.innerWidth * 0.65,
    height: window.innerHeight * 0.75,
    isDrawingMode: false
};

const canvas = new fabric.Canvas("whiteboard", cproperties);

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
