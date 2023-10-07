import { TLineData, chartData, coordinates, TFindPointInPixelArgs, IChartOptions , IMinMaxRes, IPointsStructure} from './types';

// Given a set of x,y coordinates tell which points it refers in canvas
export class MathHelper {
  xCoordinates: coordinates = [];
  yCoordinates: coordinates = [];
  xUnits: number = 1;
  yUnits: number = 1;
  lengthOfXUnits: number = 1;
  lengthOfYUnits: number = 1;

  constructor() {
    this.xCoordinates = [];
    this.yCoordinates = [];
  }

  #sortCoordinates(points: string[] | number[]) {
    if (typeof points[0] === "number") {
      return points.sort((a, b) => a - b);
    } else {
      return points;
    }
  }

  #toFixedNum(num: number) {
    return Number(num.toFixed(2));
  }

  #findPointInPixel = ({
    area,
    index,
    minMax,
    point,
    space,
    unit,
  }: TFindPointInPixelArgs) => {
    if (typeof point === "string") {
      const stringNo = index;
      return this.#toFixedNum(stringNo * unit + space);
    }

    const calibratedXForGraph = point - minMax.min;
    const reqPercentage = Math.round((calibratedXForGraph / minMax.max) * 100);
    const pixelForPoint = (area / 100) * reqPercentage;

    return this.#toFixedNum(pixelForPoint) + space;
  };

  findMinMax(chartData: chartData): IMinMaxRes {
    const xCoordinates = this.xCoordinates;
    const yCoordinates = this.yCoordinates;

    for (let lineData of chartData) {
      for (let line of lineData.data) {
        if(!xCoordinates.includes(line.x)) {
           xCoordinates.push(line.x);   
        }

        if(!yCoordinates.includes(line.y)) {
          yCoordinates.push(line.y);
        }
      }
    }

    this.#sortCoordinates(xCoordinates);
    this.#sortCoordinates(yCoordinates);
    console.log("yCoordinates", yCoordinates, xCoordinates);


    return {
      x: { min: xCoordinates[0], max: xCoordinates[xCoordinates.length - 1] },
      y: { min: yCoordinates[0], max: yCoordinates[yCoordinates.length - 1] },
    };
  }

  #findUnit(linePoints: number[] | string[], space: number) {
    if (typeof linePoints[0] === "string") {
      return space / linePoints.length;
    } else {
      this.#sortCoordinates(linePoints);
      // const totalRepresentationInGivenUnit = (linePoints[linePoints.length - 1] - linePoints[0]);
      // return Number((space / unit).toFixed(2))
      const equivalentRepresantationOfUnit = space / linePoints.length;
      return Number(equivalentRepresantationOfUnit.toFixed(2));
    }
  }

  findUnits(
    xPoints: number[] | string[],
    yPoints: number[] | string[],
    width: number,
    height: number
  ) {
    const xUnit = this.#findUnit(xPoints, width);
    const yUnit = this.#findUnit(yPoints, height);

    this.xUnits = xUnit;
    this.yUnits = yUnit;
    this.lengthOfXUnits = xPoints.length;
    this.lengthOfYUnits = yPoints.length;
    return { xUnit, yUnit };
  }

  #prepareCoordinatesForLine(lineData: TLineData) {
    let points = [];
    let xPoints = [];
    let yPoints = [];

    for (let line of lineData) {
      points.push([line.x, line.y]);
      xPoints.push(line.x);
      yPoints.push(line.y);
    }

    return { points, xPoints, yPoints };
  }

  convertPointsToPx(
    lineData: TLineData,
    { xDrawingArea, yDrawingArea, height, space }: IChartOptions,
    minMax: IMinMaxRes
  ): IPointsStructure[] {
    const { points, xPoints, yPoints } =
      this.#prepareCoordinatesForLine(lineData);

    const units = this.findUnits(xPoints, yPoints, xDrawingArea, yDrawingArea);

    const pointsInPx = points.map((point, index) => {
      const xCoordinate = this.#findPointInPixel({
        area: xDrawingArea,
        index,
        minMax: minMax.x,
        unit: units.xUnit,
        space,
        point: point[0],
      });
      // y coordinate in canvas comes from top to bottom, in graph it is inverse
      const yCoordinate =
        height -
        this.#findPointInPixel({
          area: yDrawingArea,
          point: point[1],
          minMax: minMax.y,
          index,
          unit: units.yUnit,
          space,
        });

      return { xCoordinate, yCoordinate };
    });

    return pointsInPx;
  }
}
