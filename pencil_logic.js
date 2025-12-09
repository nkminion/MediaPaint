const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");

const gestureOutput = document.getElementById("gesture-output");
const cursorElement = document.getElementById("virtual-cursor");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let brushWidth = 5;
let segmentSize = 0;
let currentTool = "solid";

document.getElementById("tool-size").innerHTML = brushWidth
document.getElementById("segment-size").innerHTML = segmentSize

function ClearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function SaveCanvas() {
    let Image = canvas.toDataURL("image/png");
    const ImageElement = document.createElement("a");
    ImageElement.href = Image;
    ImageElement.download = "MediaPaintCanvas.png"
    ImageElement.click()
}

function activateSolid() {
    currentTool = "solid";
    segmentSize = 0;
    document.getElementById("segment-size").innerHTML = segmentSize;
    document.getElementById("tool-status").innerHTML = "Brush Size";
}

function activateDotted() {
    currentTool = "dotted";
    segmentSize = 15;
    document.getElementById("segment-size").innerHTML = segmentSize;
    document.getElementById("tool-status").innerHTML = "Brush Size";
}

function activateEraser() {
    currentTool = "eraser";
    segmentSize = 0;
    document.getElementById("segment-size").innerHTML = segmentSize;
    document.getElementById("tool-status").innerHTML = "Eraser Size";
}

function checkSelect(Xpos,Ypos) {
    let hoverElement = document.elementFromPoint(Xpos,Ypos);
    if (hoverElement === null) return;

    let hoveredElements = document.getElementsByClassName('color-btn-hover');
    while (hoveredElements.length)
        hoveredElements[0].classList.remove('color-btn-hover');
    hoveredElements = document.getElementsByClassName('clear-btn-hover');
    while (hoveredElements.length)
        hoveredElements[0].classList.remove('clear-btn-hover');
    hoveredElements = document.getElementsByClassName('save-btn-hover');
    while (hoveredElements.length)
        hoveredElements[0].classList.remove('save-btn-hover');
    hoveredElements = document.getElementsByClassName('save-btn-hover');
    while (hoveredElements.length)
        hoveredElements[0].classList.remove('save-btn-hover');
    hoveredElements = document.getElementsByClassName('tool-btn-hover');
    while (hoveredElements.length)
        hoveredElements[0].classList.remove('tool-btn-hover');
    
    if (hoverElement.classList.contains("tool-btn"))
    {
        hoverElement.classList.add("tool-btn-hover");
    }
    else if (hoverElement.classList.contains("save-btn"))
    {
        hoverElement.classList.add("save-btn-hover");
    }
    else if (hoverElement.classList.contains("clear-btn"))
    {
        hoverElement.classList.add("clear-btn-hover");
    }
    else if (hoverElement.classList.contains("color-btn"))
    {
        hoverElement.classList.add("color-btn-hover");
    }
}

const startDraw = () => {
    if(currentTool === "solid")
    {
        ctx.globalCompositeOperation="source-over";
        isDrawing = true;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = colorPicker.value;
        ctx.setLineDash([])
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }
    else if (currentTool === "dotted")
    {
        ctx.globalCompositeOperation="source-over";
        isDrawing = true;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = colorPicker.value;
        ctx.setLineDash([segmentSize, segmentSize]);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }
    else if (currentTool === "eraser")
    {
        ctx.globalCompositeOperation="destination-out";
        isDrawing = true;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
    }
    else
    {
        return;
    }
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}
const stopDraw = () => {
    isDrawing = false;
}

function drawAt(x, y) {

}

function eraseAt(x, y) {

}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);

cursorElement.style.position = "fixed";
cursorElement.style.pointerEvents = "none";
cursorElement.style.zIndex = "9999";

function update() {
    if (typeof window.HandTracker !== "undefined") {

        const xNorm = window.HandTracker.x;
        const yNorm = window.HandTracker.y;
        const gesture = window.HandTracker.gesture;
        const isHand = window.HandTracker.isHandPresent();

        if (isHand) {
            cursorElement.style.display = "block";

            const screenX = Math.max(0, Math.min(1, xNorm)) * window.innerWidth;
            const screenY = Math.max(0, Math.min(1, yNorm)) * window.innerHeight;

            cursorElement.style.left = screenX + "px";
            cursorElement.style.top = screenY + "px";

            gestureOutput.innerText = "Gesture: " + (gesture || "none");

            const canvasRect = canvas.getBoundingClientRect();
            const canvasX = screenX - canvasRect.left;
            const canvasY = screenY - canvasRect.top;

            if (gesture === "write") {
                cursorElement.style.backgroundColor = "cyan";
                drawAt(canvasX, canvasY);
            }
            else if (gesture === "hover") {
                cursorElement.style.backgroundColor = "green";
                checkSelect(screenX,screenY);
            }
            else {
                cursorElement.style.backgroundColor = "yellow";
                ctx.beginPath();
            }
        } else {
            cursorElement.style.display = "none";
            gestureOutput.innerText = "Gesture: none";
        }
    }

    requestAnimationFrame(update);
}

requestAnimationFrame(update);
