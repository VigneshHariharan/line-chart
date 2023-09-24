import "./style.css";

const canvas = <HTMLCanvasElement>document.querySelector("#roundedRectangle");

const context = canvas?.getContext("2d");

if (context) {
  context.fillStyle = "whitesmoke";
  context.fillRect(100, 100, 400, 300);

  context.beginPath();
  context.moveTo(100, 150);
  context.arcTo(100, 100, 300, 100, 50);
  context.strokeStyle = "green";
  context.lineWidth = 2;
  context.stroke();
  context.closePath();

  context.beginPath();
  context.bezierCurveTo(400, 400, 350, 300, 250, 200);
  context.bezierCurveTo(250, 200, 450, 300, 150, 100);

  context.strokeStyle = "orange";
  context.stroke();
  context.closePath();
}



