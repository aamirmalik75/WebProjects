import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { tokens } from '../theme'
import { useMediaQuery } from '@mui/material';

const LineChart = ({ data, additionData }) => {
  const colors = tokens();

  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  const formattedData = Object.values(data).map(industryData => ({
    id: industryData.id,
    data: industryData.data.map(item => ({
      x: item.x,
      y: item.y
    }))
  }));

  return (
    <ResponsiveLine
      data={formattedData}
      theme={{
        tooltip: {
          basic: {
            color: '#000000'
          }
        },
        axis: {
          domain: {
            line: {
              stroke: colors.grey[500]
            }
          },
          legend: {
            text: {
              fill: colors.grey[500]
            }
          },
          ticks: {
            line: {
              stroke: colors.grey[500],
              strokeWidth: 1
            },
            text: {
              fill: colors.grey[500]
            }
          }
        },
        legends: {
          text: {
            fill: colors.grey[500]
          }
        },
        crosshair: {
          line: {
            stroke: colors.orangeAccent[500]
          }
        }
      }}
      colors={{ scheme: 'category10' }}
      margin={{ top: 50, right: isNonMobileScreen ? 110 : 10, bottom: 50, left: isNonMobileScreen ? 80 : 55 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={isNonMediumScreen ? {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: additionData.bottom,
        legendOffset: 36,
        legendPosition: 'middle',

      } : null}
      axisLeft={{
        tickSize: 5,
        tickValues: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isNonMobileScreen && additionData.left,
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      enableCrosshair={true}
      useMesh={true}
      legends={isNonMobileScreen ? [
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ] : []}
    />
  )
}

export default LineChart
