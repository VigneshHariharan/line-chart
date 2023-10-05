import React, { useEffect, useRef } from 'react';
import { DrawLineChart } from '../lineChart'
import { lineChartData, lineChartMetaData } from '../data';

interface ILineChart {
  /** unique id for the element */
  id: string;
  /** width of canvas in pixels */
  width?: number;
  /** height of canvas in pixels */
  height?: number;
}

const LineChart = ({ id, height, width }: ILineChart) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if(!canvasRef.current) return;

        const canvasElement: HTMLCanvasElement = canvasRef.current;

        const context = canvasElement.getContext('2d')

        if(context) {
           const lineChart = new DrawLineChart(context, lineChartData, lineChartMetaData, {});
           lineChart.initChart()
        }
    }, [canvasRef, width, height]);

    return (<canvas id={id} ref={canvasRef} width={Number(width) || '300px'} height={Number(height) ||'300px'}></canvas>)
}

export { LineChart }