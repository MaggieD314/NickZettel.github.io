
// find the canvas in the html
const canvas = document.getElementById('canvas');
// get the 2d drawing context from the canvas which provides methods for drawing shapes and other content
const ctx = canvas.getContext('2d');
// create blank imagedata allows you to update pixel data in bulk instead of one pixel at a time; providing a structure for manipulating pixel data
const imageData = ctx.createImageData(canvas.width, canvas.height);
// extract pixel array from imagedata allowing direct pixel manipulation and access to the alpha channel
const data = imageData.data;


let numBalls;
let connectDistance;
let visibility;
let nodes;
let text;
let x;
let y;

canvas.width = window.innerWidth;  // Set internal pixel width to match viewport width
canvas.height = window.innerHeight;

area = canvas.width * canvas.height;
numBalls = area/1300;
connectDistance = 50;
visibility =  Math.floor(Math.max(canvas.width,canvas.height)/4);
   
nodes = [];
for (let i = 0; i < numBalls; i++){
    nodes.push(createNode())
}

text = 'Hello, I\'m Nick.';
const fontSize = 36; // Font size in pixels
ctx.font = `${fontSize}px Helvetica`; // Set the font size and family

// Measure text width and height
const textWidth = ctx.measureText(text).width;
const textHeight = fontSize; // Rough estimate of text height

// Calculate text position
x = (canvas.width - textWidth) / 2; // Center horizontally
y = (canvas.height + textHeight) / 2; // Center vertically

// Draw text on canvas
ctx.textAlign = 'left'; // Align text left for proper centering
ctx.textBaseline = 'middle'; // Align text vertically center
ctx.fillStyle = 'black'; // Text color
ctx.fillText(text, x, y);



let mouse = {
    x: canvas.width/2,
    y: canvas.height/2
};



function randomNumberBetweenExcludingZero() {
    let x = 0; 
    let y = 0; 
    while (x === 0 && y === 0) {
        x = (Math.random() * 0.6) - 0.3; // Generates between -0.2 and 0.2
        y = (Math.random() * 0.6) - 0.3; // Generates between -0.2 and 0.2
    }
    return [x, y];
}


function createNode(){
    let [dx,dy] = randomNumberBetweenExcludingZero();
    let x = Math.floor(Math.random()*canvas.width-1)
    let y = Math.floor(Math.random()*canvas.height-1)
    return {
        radius: 1,
        dx: dx,
        dy: dy,
        x: x,
        y: y,
        actualX: x,
        actualY: y,

        move: function(){
            this.actualX += this.dx;
            this.actualY += this.dy;
            this.x = Math.floor(this.actualX);
            this.y = Math.floor(this.actualY);
            if (this.x+this.radius >= canvas.width || this.x - this.radius <= 0) {
                this.dx = -this.dx
            }
            if (this.y+this.radius >= canvas.height || this.y - this.radius <= 0) {
                this.dy = -this.dy
            }
        }
    }
}

function distBetweenPoints(obj1, obj2) {
    let num1 = Math.pow(obj1.x - obj2.x, 2); // (x2 - x1)^2
    let num2 = Math.pow(obj1.y - obj2.y, 2); // (y2 - y1)^2
    let distance = Math.sqrt(num1 + num2);
    return distance;
}

function drawBetween(obj1,obj2,alpha){
    
    ctx.beginPath();
    ctx.moveTo(obj1.x,obj1.y)
    ctx.lineTo(obj2.x,obj2.y);
    ctx.strokeStyle = `rgba(0, 149, 221, ${alpha})`;
    ctx.stroke();
}


// function to update the canvas
function update(){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++){
        nodes[i].move()
        ctx.beginPath();
        ctx.arc(nodes[i].x,nodes[i].y,nodes[i].radius,0,Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill()
        ctx.closePath()
    }
    closeNodes = [];
    for (let i = 0; i < nodes.length; i++){
        if (distBetweenPoints(mouse,nodes[i]) < visibility) {
            closeNodes.push(nodes[i])
        }
    }
    console.log(visibility)
    for (let i = 0; i < closeNodes.length; i++){
        for (let j = 0; j < closeNodes.length; j++){
            let distance1 = distBetweenPoints(closeNodes[i],closeNodes[j]);
            if (distance1<connectDistance && j!=i){
                let distance2 = distBetweenPoints(closeNodes[j],mouse);
                let alpha = 1 - distance2/visibility

                drawBetween(closeNodes[i],closeNodes[j],alpha);
            }
        }
        
    }
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x, y);
    requestAnimationFrame(update);
}


update();
