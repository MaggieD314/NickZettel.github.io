// find the canvas in the html
const canvas = document.getElementById('canvas');
// get the 2d drawing context from the canvas which provides methods for drawing shapes and other content
const ctx = canvas.getContext('2d');
// create blank imagedata allows you to update pixel data in bulk instead of one pixel at a time; providing a structure for manipulating pixel data
const imageData = ctx.createImageData(canvas.width, canvas.height);
// extract pixel array from imagedata allowing direct pixel manipulation and access to the alpha channel
const data = imageData.data;
// resize canvas placed in a function so it can be called whenever the window is resized
function resizeCanvas() {
    canvas.width = window.innerWidth;  // Set internal pixel width to match viewport width
    canvas.height = window.innerHeight; // Set internal pixel height to match viewport height
}
//initial resizing of the canvas
resizeCanvas();
//ready for resizing
window.addEventListener('resize',resizeCanvas)

ctx.strokeStyle = 'red';



ctx.beginPath();
ctx.moveTo(50, 100);
ctx.lineTo(250, 100);
ctx.stroke();  // Canvas will show another red line

ctx.beginPath();
ctx.moveTo(50, 150);
ctx.lineTo(250, 280);
ctx.stroke();  // Canvas will show a diagonal red line



const startingX = Math.floor(Math.random()*canvas.width-1);

function randomNumberBetweenExcludingZero(){
    let x = 0; 
    let y = 0; 
    while (x == 0 && y == 0){
        x = Math.floor(Math.random() * 7) - 3;
        y = Math.floor(Math.random() * 7) - 3;
    }
    return [x,y];
}

function createNode(){
    let [dx,dy] = randomNumberBetweenExcludingZero();
    console.log(dx,dy)
    return {
        radius: 3,
        dx: dx,
        dy: dy,
        x: Math.floor(Math.random()*canvas.width-1),
        y: Math.floor(Math.random()*canvas.height-1),
        move: function(){
            this.x += this.dx;
            this.y += this.dy;
            if (this.x+this.radius >= canvas.width || this.x - this.radius <= 0) {
                this.dx = -this.dx
            }
            if (this.y+this.radius >= canvas.height || this.y - this.radius <= 0) {
                this.dy = -this.dy
            }
        }
    }
}

nodes = [];

for (let i = 0; i < 20; i++){
    nodes.push(createNode())
}

// function to update the canvas
function update(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++){
        nodes[i].move()
        ctx.beginPath();
        ctx.arc(nodes[i].x,nodes[i].y,nodes[i].radius,0,Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill()
        ctx.closePath()
    }
    
    requestAnimationFrame(update);
}
update();
