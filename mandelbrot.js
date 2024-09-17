const canvas= document.getElementById("canvas");
const ctx= canvas.getContext("2d");
const width= 500;
const height =500;
const scalefactor =1/100;
const originR=0;
const originI=0;

const colors = [
    "rgb(254, 0, 0)",
    "rgb(255, 121, 1)",
    "rgb(255, 255, 11)",
    "rgb(34, 219, 19)",
    "rgb(36, 48, 255)",
    "rgb(102, 0, 146)",
    "rgb(200, 0, 249)"
];

// f(z)= z^2 +c ---- Mandelbrot Eq
//z0= 0, c=>is some complex number(points we are taking)(lets take it as 1)
//z1=1, f(1)=1+1=2
//z2=2, f(2)=4+1=5
//z3=5, f(5)=25+1=26

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        plotInSet(x, y);
    }
}

canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const [cr, ci] = screenToWorld(x, y);
    label.textContent = `cr = ${cr}  ci = ${ci}`;
    plotInSet(x, y);
});



function plotInSet(x, y) {
    // ctx.clearRect(0, 0, width, height);
    // console.log("x", x, "y", y);
    const [cr, ci] = screenToWorld(x, y);
    // console.log("r", cr, "i", ci);
    
    let zr = 0;
    let zi = 0;
    for (let k = 0; k < 100; k++) {
        const _zr = zr * zr - zi * zi + cr;
        const _zi = 2 * zr * zi + ci;
        zr = _zr;
        zi = _zi;
        const dist = Math.sqrt(zr * zr + zi * zi);
        if (dist > 2) {
            const color = colors[k % colors.length];
            ctx.fillStyle = color;
            plotPoint(x, y, 1);
            return;
        }
        // const [x1, y1] = worldToScreen(zr, zi);
        
        // ctx.fillStyle = color;
        // plotPoint(x1, y1);
    }
    
    ctx.fillStyle = "black";
    plotPoint(x, y, 1);
}





function plotLine(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

}


//Making shitty circles
function plotPoint(x,y,radius){
 ctx.beginPath();
 ctx.arc(x, y, radius, 0, 2 * Math.PI);
 ctx.fill();
}

function screenToWorld(x,y){
    const r = originR+(x - width / 2)* scalefactor;
    const i = originI-(y - height / 2)* scalefactor;
    return [r, i];

}

function worldToScreen(r,i){
   const x= (r-originR)/scalefactor + width/2;
   const y= -(i-originI)/scalefactor + height/2;
   return [x,y];

}
