import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'

const PieChartComp = ({ data, width = 400, height = 300, cx = 150, cy = 150 }) => {
  return (
    <PieChart
      series={[
        {
          data: data,
          innerRadius: 30,
          outerRadius: 80,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
          cx: cx,
          cy: cy,
        }
      ]}
      width={width}
      height={height}
    />
  )
}

export default PieChartComp
