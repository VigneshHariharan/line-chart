import "./style.css";
import { lineChartData, lineChartMetaData } from "./data";
import { chartData, metaData, IChartOptions, IPointsStructure } from "./chart/types";
import { MathHelper } from "./chart/math.helpers";

const DEFAULT_SPACE = 50;

class DrawLineChart extends MathHelper {
  chartData: chartData = lineChartData;
  metaData: metaData = lineChartMetaData;
  context: CanvasRenderingContext2D;
  chartOptions: IChartOptions = {
    height: 0,
    space: DEFAULT_SPACE,
    width: 0,
    xDrawingArea: 0,
    yDrawingArea: 0
  };

  constructor(
    context: CanvasRenderingContext2D,
    chartData: typeof lineChartData,
    metaData: typeof lineChartMetaData, 
    options: Partial<IChartOptions>
  ) {
    super();
    this.chartData = chartData;
    this.metaData = metaData;
    this.context = context;
    this.chartOptions = {
      height: 0,
      space: DEFAULT_SPACE,
      width: 0,
      xDrawingArea: 0,
      yDrawingArea: 0,
      ...options
  }
    
  }

  setChartSizes(options: IChartOptions) {
    this.chartOptions = {
      ...this.chartOptions,
      ...options,
    }
  }

  #drawChartRegion({ height, space, width }: Required<IChartOptions>) {
    this.context.beginPath();
    this.context.moveTo(space, space);
    this.context.lineTo(space, height - space);
    this.context.lineTo(width - space, height - space);
    this.context.strokeStyle = "white";
    this.context.stroke();
    this.context.closePath();

    const minMax = this.findMinMax(this.chartData);
    for (let lineData of this.chartData) {
      // const { xPoints, yPoints, points } = this.prepareCoordinatesForLine(
      //   lineData.data
      // );

      // const po = this.findUnits(
      //   xPoints,
      //   yPoints,
      //   xDrawingArea,
      //   yDrawingArea
      // );

      // const findPointInPixel = (coor, minMax, index, unit, area) => {
      //   if(typeof coor === 'string') {
      //     const stringNo = index;
      //     return (stringNo * unit) + space;
      //   }

      //   const calibratedXForGraph = coor - minMax.min;
      //   const reqPercentage = Math.round((calibratedXForGraph / minMax.max) * 100);
      //        const pixelForPoint = (area / 100) * reqPercentage;
      //   return Number(pixelForPoint.toFixed(2)) + space;
      // }
      const points = this.convertPointsToPx(lineData.data, this.chartOptions, minMax)

      points.forEach(({ xCoordinate, yCoordinate }, index) => {
        // const xInPixelForPoint = findPointInPixel(point[0], x, index, po.xUnit, xDrawingArea);
        // // y coordinate in canvas comes from top to bottom, in graph it is inverse
        // const yInPixelForPoint = height - findPointInPixel(point[1], y, index, po.yUnit, yDrawingArea);

        this.context.beginPath();
        // this.context.arc(
        //   xCoordinate,
        //   yCoordinate,
        //   10,
        //   Math.PI,
        //   3 * Math.PI
        // );

        const { x, y } = lineData.data[index]
        // this.context.fillText(`${x}-${y}`, xCoordinate + 12, yCoordinate + 5);
        this.context.stroke();
        this.context.closePath();
      });
        this.#drawLine(points, lineData.color)
    }
  }

  #drawLine(points: IPointsStructure[], color: string) {
    this.context.beginPath();
    let shouldMove = false;
    for (let { xCoordinate,yCoordinate } of points) {

      if(!shouldMove) {
        this.context.moveTo(xCoordinate,yCoordinate);
        shouldMove = true
      } else {
        this.context.lineTo(xCoordinate,yCoordinate)
      }
    }

    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
  }

  initChart() {
    if (!this.context) {
      throw new Error('Canvas context is not provided')
    }
    const space = this?.chartOptions?.space || DEFAULT_SPACE;

    const options = {
      space: DEFAULT_SPACE,
      width: this.context.canvas.width,
      height: this.context.canvas.height,
      yDrawingArea: this.context.canvas.height - 2 * space,
      xDrawingArea: this.context.canvas.width - 2 * space,
    };
    this.setChartSizes(options)
    this.#drawChartRegion(this.chartOptions);
  }
}
// create canvas and attach element
const canvas = document.createElement("canvas");

const lineChart = document.querySelector("#line-chart");
canvas.id = "line-chart-graph";

canvas.setAttribute("width", "666px");
canvas.setAttribute("height", "500px");
const context = canvas.getContext("2d");

if (context) {
  const chart1 = new DrawLineChart(context, lineChartData, lineChartMetaData, {});
  chart1.initChart();
}

if (lineChart) {
  lineChart.appendChild(canvas);
}
