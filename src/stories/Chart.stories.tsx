
import { LineChart, ILineChart } from '../components/LineChart';
import type { Meta } from '@storybook/react';
import { lineChartData, lineChartMetaData } from './data'

const meta: Meta<typeof LineChart> = {
  title: 'LineChart',
  component: LineChart,
};

const defaultArgs : ILineChart = {
  id: "line-3",
  width: 600,
  height: 600,
  chartData: lineChartData,
  metaData: lineChartMetaData
};

export const Default = {
  args: defaultArgs,
};
export default meta;