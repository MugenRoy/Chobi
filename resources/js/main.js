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


let activeTool = null;

function selectionTool() {
    canvas.isDrawingMode = false;
    activeTool = "selection";

    const select = document.getElementById("selection-tool");
    select.classList.add("tool-active");
}

function drawTool() {
    canvas.isDrawingMode = true;
    activeTool = "draw";

    const draw = document.getElementById("draw-tool");
    draw.classList.add("tool-active");
}

document.addEventListener("keydown", function(event) {
    const activeObject = canvas.getActiveObject();

    if (activeTool === "selection" && activeObject) {
        if (event.key === "Delete") {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.renderAll();
        }

        if (event.ctrlKey && event.key.toLowerCase() === "d") {
            event.preventDefault();

            activeObject.clone(function(cloned) {
                cloned.set({
                    left: activeObject.left + 10,
                    top: activeObject.top + 10
                });

                canvas.add(cloned);
                canvas.setActiveObject(cloned);
                canvas.renderAll();
            });
        }
    }
});
