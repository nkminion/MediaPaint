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
let lastElement = null;
let eventHandler = null;

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

function unselect()
{
    let hoveredElements = document.getElementsByClassName('hover');
    while (hoveredElements.length)
        hoveredElements[0].classList.remove('hover');
}

function checkSelect(Xpos,Ypos) {
    let hoverElement = document.elementFromPoint(Xpos,Ypos);
    if (hoverElement === null) return;

    if (hoverElement !== lastElement)
    {
        if (lastElement)
        {
            if (eventHandler)
            {
                unselect();
                lastElement.removeEventListener('transitionend',eventHandler);
                eventHandler = null;
            }
        }
        if (hoverElement)
        {
            eventHandler = function(e){
                if (e.propertyName!=='transform')
                {
                    return;
                }
                const target = e.target;
                target.click();
                unselect();
                hoverElement.removeEventListener('transitionend',eventHandler);
                eventHandler = null;
                lastElement = null;
            }

            function select()
            {
                hoverElement.classList.add("hover");
            }

            hoverElement.addEventListener('transitionend',eventHandler);
            setTimeout(select(),10);
        }
        lastElement = hoverElement;
    }
}

const startDraw = (x,y) => {
    if(currentTool === "solid")
    {
        ctx.globalCompositeOperation="source-over";
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
    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = colorPicker.value;
    ctx.moveTo(x,y);
}

const drawing = (x,y) => {
    if (!isDrawing) return;
    ctx.lineTo(x, y);
    ctx.stroke();
}
const stopDraw = () => {
    isDrawing = false;
}


// Event Handlers

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
                unselect();
                cursorElement.style.backgroundColor = "cyan";
                if (!isDrawing)
                {
                    startDraw(canvasX,canvasY);
                }
                else
                {
                    drawing(canvasX,canvasY);
                }
            }
            else if (gesture === "hover") {
                stopDraw();
                cursorElement.style.backgroundColor = "pink";
                checkSelect(screenX,screenY);
            }
            else {
                stopDraw();
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