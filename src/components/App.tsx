import React from 'react';
import { LineChart } from "./LineChart";

function App() {
    return (
      <>
        <LineChart id="line-chart" width={500} height={500} />
        <LineChart id="line-chart-2" width={600} height={800} />
        <LineChart id="line-chart-3" width={500} height={500} />
      </>
    );
}

export { App }