import './style.css'

const canvas = document.querySelector("#board");


const context = canvas?.getContext("2d")

if(!context) {
  window.alert("canvas 2d context not supported")
}

context.strokeStyle = "red";

context.beginPath();

context.lineTo(100, 100);
context.lineTo(100,300);
context.stroke()



// context.beginPath();
// context.lineTo(400, 100);
// context.lineTo(350, 300);
// context.stroke();

context.beginPath();
context.lineTo(100, 300);
context.lineTo(350, 300);
context.stroke();



context.beginPath();
context.moveTo(100, 100);
context.arcTo(100, 300, 250, 350, 40);
context.strokeStyle = "blue";
context.stroke();