const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let brushWidth = 5;
let segmentSize = 0;
let currentTool = "none";

document.getElementById("brush-size").innerHTML = brushWidth
document.getElementById("segment-size").innerHTML = segmentSize

function ClearCanvas()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function SaveCanvas()
{
    let Image = canvas.toDataURL("image/png");
    const ImageElement = document.createElement("a");
    ImageElement.href = Image;
    ImageElement.download = "MediaPaintCanvas.png"
    ImageElement.click()
}

function activateSolid() {
    currentTool = "solid";
    segmentSize = 0;
    document.getElementById("segment-size").innerHTML = segmentSize
}

function activateDotted() {
    currentTool = "dotted";
    segmentSize = 15;
    document.getElementById("segment-size").innerHTML = segmentSize
}

const startDraw = () => {
    if(currentTool === "solid")
    {
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
        isDrawing = true;
        ctx.beginPath(); 
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = colorPicker.value; 
        ctx.setLineDash([segmentSize,segmentSize]);
        ctx.lineCap = "round"; 
        ctx.lineJoin = "round";
    }
    else
    {
        return;
    }
}

const drawing = (e) => {
    if(!isDrawing) return; 
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}
const stopDraw = () => {
    isDrawing = false;
}
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);