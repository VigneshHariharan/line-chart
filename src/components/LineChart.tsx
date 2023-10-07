import React, { useEffect, useRef } from 'react';
import { DrawLineChart } from '../lineChart'
import {
  chartData,
  metaData,
} from "../chart/types";

export interface ILineChart {
  /** unique id for the element */
  id: string;
  /** width of canvas in pixels */
  width?: number;
  /** height of canvas in pixels */
  height?: number;
  /** height of canvas in pixels */
  space?: number;
  /** chart data with data -> { x,y format } */
  chartData: chartData;
  /** chart for labels */
  metaData: metaData;
}

const LineChart = ({ id, height, width, space, chartData, metaData }: ILineChart) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if(!canvasRef.current) return;

        const canvasElement: HTMLCanvasElement = canvasRef.current;

        const context = canvasElement.getContext('2d')

        if(context) {
           const lineChart = new DrawLineChart(
             context,
             chartData,
             metaData,
             {
              height,
              width,
              space,
             }
           );
           lineChart.initChart()
        }
    }, [canvasRef, width, height]);

    return (<canvas id={id} ref={canvasRef} width={Number(width) || '300px'} height={Number(height) ||'300px'}></canvas>)
}

export { LineChart }