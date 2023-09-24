import "./style.css";
// import Decast from './deCastLib'

const canvas = <HTMLCanvasElement>document.querySelector("#Casteljau");

// ref: https://blog.demofox.org/2015/07/05/the-de-casteljeau-algorithm-for-evaluating-bezier-curves/

console.log('canvas',canvas)
const context = canvas?.getContext("2d");

type CP =  [x: number, y:number];

class DeCastelJeau {
  cp1: CP = [100, 400];
  cp2: CP = [200, 100];
  cp3: CP = [400, 400];
  context: CanvasRenderingContext2D;
  t: number = 0;
  unit: number = 0.05;
  lastRadius: any;
  clicks: number = 0;

  constructor(context: CanvasRenderingContext2D, cp1: CP, cp2: CP, cp3: CP) {
    this.context = context;
    this.cp1 = cp1;
    this.cp2 = cp2;
    this.cp3 = cp3;
    this.t = 0;
    this.unit = 0.005;
    this.lastRadius = null;
    this.clicks = 0;
  }

  createAxisWithNumber() {
    this.context.beginPath();
    this.context.strokeStyle = "red";

    this.context.lineTo(0 , 100);
    this.context.lineTo(600, 100);



    this.context.stroke();

    this.context.closePath();

  }

  clear() {
    this.context.clearRect(10,10,580,580);
    this.t = 0;
    this.clicks = 0;
  }

  createLine(points: CP){
    this.context.lineTo(...points);
  }

  createBezierArc(points: CP){

    this.context.beginPath();
    this.context.arc(...points, 10, Math.PI , 4 * Math.PI);
    this.context.strokeStyle = 'blue';
    this.context.stroke();
    this.context.closePath();
   


    switch(this.clicks) {
      case 0:
        this.cp1 = points;
        break;
      case 1:
        this.cp2 = points;

        break;

      case 2: 
        this.cp3 = points;
        break;
    }

    //  if (this.clicks === 0) {
    //    this.context.beginPath();
    //    this.context.lineTo(...points);
    //    this.context.stroke();
    //  } else if (this.clicks === 2) {
    //    console.log("moveTo, ", this.cp1);

    //    this.context.moveTo(...this.cp1);
    //    console.log("quadraticCurveTo, ", this.cp2, this.cp3);

    //    this.context.quadraticCurveTo(...this.cp2, ...this.cp3);
    //    this.context.closePath();
    //    // return;
    //  } else {
    //    this.createLine(points);
    //  }

    if(this.clicks > 2) {
      this.#drawCurve()
    }

    // this.context.strokeStyle = "red";
    // this.context.stroke();

    this.clicks += 1;
  }


  draw() {
    this.context.clearRect(10, 10, 580, 580);
    this.#drawOutline();
    this.#drawCurve();

    const cpToRadius = this.#findCPAtT(this.t);
    this.#drawArcAtPoint(...cpToRadius, "red");

    this.t = this.t + this.unit;
     if (this.t > 1) {
       return;
     }

    requestAnimationFrame(this.draw.bind(this));

  }

  #findCPAtT(t: number = this.t) {
    const point1 = this.#lerp(this.cp1, this.cp2, t);
    const point2 = this.#lerp(this.cp2, this.cp3, t);
    const point3 = this.#lerp(point1, point2, t);
    return [point1, point2, point3];
  }

  #drawArcAtPoint(point1: CP, point2: CP, point3: CP, color: "green", lineWidth: number = 1) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.lineTo(...point1);
    this.context.lineTo(...point2);
    this.context.arc(...point3, 2, Math.PI, 4 * Math.PI);
    this.context.lineWidth = lineWidth;
    this.context.stroke();
    this.context.closePath();
  }

  #drawOutline() {
    this.context.beginPath();
    this.context.lineWidth = 4;

    this.context.strokeStyle = "orange";
    this.context.moveTo(...this.cp1);
    this.context.lineTo(...this.cp2);
    this.context.lineTo(...this.cp3);

    this.context.stroke();
    this.context.closePath();
  }

  #drawCurve(color?: string, lineWidth?: number) {
    this.context.beginPath();
    this.context.strokeStyle = color ||"whitesmoke";
    this.context.moveTo(...this.cp1,);

    this.context.quadraticCurveTo(...this.cp2,  ...this.cp3);
    this.context.lineWidth = lineWidth || 3;
    this.context.stroke();
    this.context.closePath();
  }

  #lerp(a: number[], b: number[], t: number): [x: number, y: number] {
    const len = a.length;

    let x = [];
    for (var i = 0; i < len; i++) x.push(a[i] + t * (b[i] - a[i]));
    return x;
  }
}

let algo: DeCastelJeau | null = null;

if(context) {
    algo = new DeCastelJeau(context, [100, 500], [200, 100], [400, 400]);
}
const chartRefreshButton = document.querySelector("#chart-refresh");

canvas.addEventListener("click", (event) => {
  if(algo) {
    const rect = canvas.getBoundingClientRect();
    algo.createBezierArc([event.clientX - rect.x, event.clientY - rect.y]);
  }
})

algo.createAxisWithNumber();


chartRefreshButton?.addEventListener('click', () => {

  if (algo) {
    algo.clear();
    algo.draw();
  }

})
