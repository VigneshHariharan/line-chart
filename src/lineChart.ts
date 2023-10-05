import "./style.css";
import { lineChartData, lineChartMetaData } from "./data";
import { chartData, metaData, IChartOptions, IPointsStructure, IMinMaxRes } from "./chart/types";
import { MathHelper } from "./chart/math.helpers";

const DEFAULT_SPACE = 50;

export class DrawLineChart extends MathHelper {
  chartData: chartData = lineChartData;
  metaData: metaData = lineChartMetaData;
  context: CanvasRenderingContext2D;
  chartOptions: IChartOptions = {
    height: 0,
    space: DEFAULT_SPACE,
    width: 0,
    xDrawingArea: 0,
    yDrawingArea: 0,
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
      ...options,
    };
  }

  setChartSizes(options: IChartOptions) {
    this.chartOptions = {
      ...this.chartOptions,
      ...options,
    };
  }

  #fillTextForAxis(minMax: IMinMaxRes) {
    let xAxisLen = this.chartOptions.space;
    let xIndex = 0;

    this.context.textAlign = "center";
    this.context.strokeStyle = "black";

    let xUnitInGivenValue = 1;
    if (typeof minMax.x.max === "number") {
      let perUnit = minMax.x.max / this.lengthOfXUnits;
      xUnitInGivenValue = perUnit;
    }

    while (xIndex < this.lengthOfXUnits) {
      this.context.beginPath();
      this.context.moveTo(
        xAxisLen,
        this.chartOptions.height - this.chartOptions.space
      );
      this.context.lineTo(
        xAxisLen,
        this.chartOptions.height - this.chartOptions.space + 15
      );

      const text =
        typeof this.xCoordinates[xIndex] === "string"
          ? this.xCoordinates[xIndex]
          : String(((xIndex + 1) * xUnitInGivenValue).toFixed(0));
      this.context.fillText(
        text,
        xAxisLen,
        this.chartOptions.height - this.chartOptions.space + 30
      );
      this.context.stroke();
      this.context.closePath();
      xAxisLen += this.xUnits;
      xIndex += 1;
    }

    let yAxisLen = this.chartOptions.height - this.chartOptions.space;
    let yIndex = this.lengthOfYUnits - 1;

    let yUnitInGivenValue = 1;
    if(typeof minMax.y.max === 'number') {
      let perUnit = (minMax.y.max)/this.lengthOfYUnits 
      yUnitInGivenValue = perUnit;
    }
    while (yIndex > -2) {
      this.context.beginPath();
      this.context.moveTo(
        this.chartOptions.space,
        this.chartOptions.height - yAxisLen
      );
      this.context.lineTo(
        this.chartOptions.space - 15,
        this.chartOptions.height - yAxisLen
      );
      const text =
        typeof this.yCoordinates[yIndex] === "string"
          ? this.yCoordinates[yIndex]
          : String(((yIndex + 1) * yUnitInGivenValue).toFixed(0));

      this.context.fillText(
        text,
        this.chartOptions.space - 30,
        this.chartOptions.height - yAxisLen
      );
      this.context.stroke();
      this.context.closePath();

      yAxisLen -= this.yUnits;
      yIndex -= 1;
    }
  }

  #drawChartRegion({ height, space, width }: Required<IChartOptions>) {
    this.context.beginPath();
    this.context.moveTo(space, space);
    this.context.lineTo(space, height - space);
    this.context.lineTo(width - space, height - space);
    this.context.strokeStyle = "black";
    this.context.stroke();
    this.context.closePath();

    const minMax = this.findMinMax(this.chartData);
    for (let lineData of this.chartData) {
      const points = this.convertPointsToPx(
        lineData.data,
        this.chartOptions,
        minMax
      );

      points.forEach(({ xCoordinate, yCoordinate }, index) => {
        this.context.beginPath();
        this.context.arc(xCoordinate, yCoordinate, 3, Math.PI, 3 * Math.PI);

        // const { x, y } = lineData.data[index]
        // this.context.fillText(`${x}-${y}`, xCoordinate + 12, yCoordinate + 5);
        this.context.stroke();
        this.context.closePath();
      });
      this.#drawLine(points, lineData.color);
    }
    this.#fillTextForAxis(minMax);
  }

  #drawLine(points: IPointsStructure[], color: string = 'black') {
    this.context.beginPath();
    let shouldMove = false;
    for (let { xCoordinate, yCoordinate } of points) {
      if (!shouldMove) {
        this.context.moveTo(xCoordinate, yCoordinate);
        shouldMove = true;
      } else {
        this.context.lineTo(xCoordinate, yCoordinate);
      }
    }

    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
  }

  initChart() {
    if (!this.context) {
      throw new Error("Canvas context is not provided");
    }
    const space = this?.chartOptions?.space || DEFAULT_SPACE;

    const options = {
      space: DEFAULT_SPACE,
      width: this.context.canvas.width,
      height: this.context.canvas.height,
      yDrawingArea: this.context.canvas.height - 2 * space,
      xDrawingArea: this.context.canvas.width - 2 * space,
    };
    this.setChartSizes(options);
    this.#drawChartRegion(this.chartOptions);
  }
}
// // create canvas and attach element
// const canvas = document.createElement("canvas");

// const lineChart = document.querySelector("#line-chart");
// canvas.id = "line-chart-graph";

// canvas.setAttribute("width", "666px");
// canvas.setAttribute("height", "500px");
// const context = canvas.getContext("2d");

// if (context) {
//   const chart1 = new DrawLineChart(context, lineChartData, lineChartMetaData, {});
//   chart1.initChart();
// }

// if (lineChart) {
//   lineChart.appendChild(canvas);
// }
