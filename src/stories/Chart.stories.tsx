
import { LineChart } from '../components/LineChart';
import type { Meta } from '@storybook/react';


const meta: Meta<typeof LineChart> = {
  title: 'LineChart',
  component: LineChart,

};

export const Default = {
  args: {
    id: 'line-3',
    width: 600,
    height: 600
  }
}
export default meta;