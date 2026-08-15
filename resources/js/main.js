function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

const canvas = new fabric.Canvas("photo-area");

const selectionTool = document.getElementById('selection-tool');

selectionTool?.addEventListener('click', () => {
  setActiveTool('select');
});
