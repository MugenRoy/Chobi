function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

const canvas = new fabric.Canvas("photo-area");

function setup() {
  canvas.setDimensions({
      width : window.innerWidth * 0.80,
      height: window.innerHeight * 0.80});
}

setup();
