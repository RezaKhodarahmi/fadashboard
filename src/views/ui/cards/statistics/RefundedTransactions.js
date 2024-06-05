import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const SucceededTransactions = ({ total, count }) => {
  const series = [count]

  // ** Hook
  const theme = useTheme()

  const options = {
    colors: [
      theme.palette.error.main,
      hexToRGBA(theme.palette.error.main, 0.7),
      hexToRGBA(theme.palette.error.main, 0.5),
      hexToRGBA(theme.palette.error.main, 0.16)
    ],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        top: -22,
        bottom: -18
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        expandOnClick: false,
        donut: {
          size: '73%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              formatter: val => `${val}`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h2.fontSize
            },
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h5.fontSize
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h5' sx={{ mb: 0.75 }}>
                Total Refunded Transactions
              </Typography>
            </div>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'error.main' } }}>
                <Icon icon='tabler:currency-dollar-canadian' fontSize='3rem' />
                <Typography variant='h3' sx={{ color: 'error.main' }}>
                  {total}
                </Typography>
              </Box>
            </div>
          </Box>
          <ReactApexcharts type='donut' width={150} height={175} series={series} options={options} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default SucceededTransactions
