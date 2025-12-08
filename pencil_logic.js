const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let brushWidth = 5;
let currentTool = "none"; 
function activatePencil() {
    currentTool = "pencil";
}

function activateBrush() {
    currentTool = "brush";
}

const startDraw = () => {
    if(currentTool !== "pencil") return;
    isDrawing = true;
    ctx.beginPath(); 
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = colorPicker.value; 
    ctx.lineCap = "round"; 
    ctx.lineJoin = "round";
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