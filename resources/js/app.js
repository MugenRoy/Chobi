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
    selectionTool();
}

async function openExistingImage() {
    try {
        const selectedFiles = await Neutralino.os.showOpenDialog(
            "Open Image",
            {
                filters: [{
                    name: "Images",
                    extensions: [
                        "png",
                        "jpg",
                        "jpeg",
                        "bmp",
                        "webp"
                    ]
                }]
            }
        );

        if (!selectedFiles || selectedFiles.length < 1) {
            return;
        }

        const imagePath = selectedFiles[0];
        const fileData = await Neutralino.filesystem.readBinaryFile(imagePath);

        const blob = new Blob(
            [new Uint8Array(fileData)],
            { type: "image/*" }
        );

        const imageUrl = URL.createObjectURL(blob);
        const img = await fabric.Image.fromURL(imageUrl);
        img.set({
            left: canvas.width / 2,
            top: canvas.height / 2
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
    }
    catch (error) {
        await Neutralino.os.showMessageBox(
            "Error Opening Image",
            "Could not open the selected file. It may be corrupted or in an unsupported format.",
            "OK",
            "ERROR"
        );
        return;
    }

    createImage();
    canvas.requestRenderAll();
}

function createNew() {
    createImage();
    canvas.clear();
    canvas.backgroundColor = "#FFFFFF";
    canvas.requestRenderAll();
    canvas_bg.value = "#FFFFFF";
    canvas.discardActiveObject();
}

async function exportImage() {
    try {
        const savePath =
            await Neutralino.os.showSaveDialog(
                "Export Image",
                {
                    defaultPath: "chobi-export.png",
                    filters: [
                        { name: "PNG Image", extensions: ["png"] },
                        { name: "JPEG Image", extensions: ["jpg", "jpeg"] },
                        { name: "WebP Image", extensions: ["webp"] }
                    ]
                }
            );

        if (!savePath) {
            return;
        }

        const extension = savePath.split('.').pop().toLowerCase();
        let format = 'png';
        if (extension === 'jpg' || extension === 'jpeg') {
            format = 'jpeg';
        } else if (extension === 'webp') {
            format = 'webp';
        }
        const imageData = canvas.toDataURL({
            format: format
        });

        const base64Data = imageData.split(",")[1];
        const binaryData = atob(base64Data);
        const bytes = new Uint8Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
        }

        await Neutralino.filesystem.writeBinaryFile(
            savePath,
            bytes.buffer
        );
    }
    catch (error) {
        await Neutralino.os.showMessageBox(
            "Error Exporting Image",
            "Could not export image. Error: "+error,
            "OK",
            "ERROR"
        );
    }
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

const canvas_props = get("canvas-props");

canvas_props.style.display = "flex";
