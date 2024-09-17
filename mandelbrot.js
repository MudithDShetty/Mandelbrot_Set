const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = 500;
const height = 500;

let scalefactor = 1 / 100;  // Initial scale factor
let originR = 0;  // Initial real part of the origin
let originI = 0;  // Initial imaginary part of the origin

const colors = [
    "rgb(254, 0, 0)",
    "rgb(255, 121, 1)",
    "rgb(255, 255, 11)",
    "rgb(34, 219, 19)",
    "rgb(36, 48, 255)",
    "rgb(102, 0, 146)",
    "rgb(200, 0, 249)"
];

// Redraw the Mandelbrot set based on the current scale and origin
function drawMandelbrot() {
    ctx.clearRect(0, 0, width, height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            plotInSet(x, y);
        }
    }
}

canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    
    const zoomAmount = event.deltaY < 0 ? 1.1 : 0.9;  // Zoom in or out
    const [mouseCr, mouseCi] = screenToWorld(event.offsetX, event.offsetY);

    scalefactor *= zoomAmount;
    
    // Adjust the origin based on zoom to focus on the point under the cursor
    originR = mouseCr - (event.offsetX - width / 2) * scalefactor;
    originI = mouseCi + (event.offsetY - height / 2) * scalefactor;
    
    drawMandelbrot();
});

let isDragging = false;
let lastX = 0, lastY = 0;

canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
        const deltaX = event.offsetX - lastX;
        const deltaY = event.offsetY - lastY;

        // Pan by adjusting the origin
        originR -= deltaX * scalefactor;
        originI += deltaY * scalefactor;

        lastX = event.offsetX;
        lastY = event.offsetY;

        drawMandelbrot();
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

// Plot points in the Mandelbrot set
function plotInSet(x, y) {
    const [cr, ci] = screenToWorld(x, y);
    
    let zr = 0, zi = 0;
    for (let k = 0; k < 100; k++) {
        const _zr = zr * zr - zi * zi + cr;
        const _zi = 2 * zr * zi + ci;
        zr = _zr;
        zi = _zi;

        if (zr * zr + zi * zi > 4) {
            const color = colors[k % colors.length];
            ctx.fillStyle = color;
            plotPoint(x, y, 1);
            return;
        }
    }

    ctx.fillStyle = "black";
    plotPoint(x, y, 1);
}

// Plot a point
function plotPoint(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

// Convert screen coordinates to world coordinates
function screenToWorld(x, y) {
    const r = originR + (x - width / 2) * scalefactor;
    const i = originI - (y - height / 2) * scalefactor;
    return [r, i];
}

// Convert world coordinates to screen coordinates
function worldToScreen(r, i) {
    const x = (r - originR) / scalefactor + width / 2;
    const y = -(i - originI) / scalefactor + height / 2;
    return [x, y];
}

// Draw the initial Mandelbrot set
drawMandelbrot();
