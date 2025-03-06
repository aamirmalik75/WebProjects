import { ResponsiveBar } from '@nivo/bar';
import React from 'react'
import { tokens } from '../theme';
import { useMediaQuery } from '@mui/material';

const BarChart = ({ data, role }) => {
  const colors = tokens();

  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  function getRandomColor() {
    // Generate random values for red, green, and blue channels
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Construct the RGB color string
    return `rgb(${red}, ${green}, ${blue})`;
  }

  const barColors = data.map(() => getRandomColor());
  return (
    <ResponsiveBar
      data={data}
      theme={{
        tooltip: {
          basic: {
            color: '#000000'
          }
        },
        axis: {
          domain: {
            line: {
              stroke: colors.primary[500]
            }
          },
          legend: {
            text: {
              fill: colors.primary[500]
            }
          },
          ticks: {
            line: {
              stroke: colors.primary[500],
              strokeWidth: 1
            },
            text: {
              fill: colors.primary[500]
            }
          }
        },
        legends: {
          text: {
            fill: colors.primary[500]
          }
        }
      }}
      keys={role === 'employee' ? ['rating'] : ['Jobs', 'Projects', 'Hourly Jobs']}
      enableLabel={false}
      indexBy={role === 'employee' ? "application_title" : "Industry"}
      margin={{ top: 50, right: isNonMobileScreen ? 190 : 10, bottom: 50, left: isNonMobileScreen ? 50 : 15 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={role === 'employee' ? barColors : { scheme: 'spectral' }}
      borderColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            1.6
          ]
        ]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={isNonMobileScreen ? {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 25,
        legend: role === 'employee' ? 'Applications' : 'Industry',
        legendPosition: 'middle',
        legendOffset: 32,
        truncateTickAt: 0
      } : null}
      axisLeft={{
        tickSize: 5,
        tickValues: 2,
        tickPadding: 5,
        tickRotation: 0,
        legend: role === 'employee' ? 'Rating' : 'Records',
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            1.6
          ]
        ]
      }}
      legends={
        [
          {
            dataFrom: role === 'employee' ? 'indexes' : 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 80,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
    />
  )
}

export default BarChart
