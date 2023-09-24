import { lineChartData, lineChartMetaData } from "../data";


export type chartData = typeof lineChartData;
export type metaData = typeof lineChartMetaData;
export type coordinates = number[] | string[];

export type TLineData = {
  x: number | string;
  y: number | string;
}[];

export type TMinMax = {
    min: number,
    max: number
}

export type TFindPointInPixelArgs = {
  point: number | string,
  minMax: TMinMax,
  index: 0,
  unit: number,
  area: number,
  space: number
}

export interface IChartOptions {
  space: number;
  width: number;
  height: number;
  xDrawingArea: number;
  yDrawingArea: number;
}

export interface IMinMaxRes {
  x: { min: coordinates; max: coordinates };
  y: { min: coordinates; max: coordinates };
}

export interface IPointsStructure {
  xCoordinate: number;
  yCoordinate: number;
}