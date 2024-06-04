import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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

const series = [32, 41, 41, 70]

const SucceededTransactions = () => {
  const transactions = useSelector(state => state.transaction)
  const [succeededTransactionSum, setSucceededTransactionSum] = useState(0)
  const [refundedTransactionSum, setRefundedTransactionSum] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [exportStartDate, setExportStartDate] = useState(null)
  const [exportEndDate, setExportEndDate] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('succeeded')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCourses, setSelectedCourses] = useState([])
  const [courses, setCourses] = useState([])
  const [activeFilter, setActiveFilter] = useState('')

  const filteredTransaction = Array.isArray(transactions?.data?.data)
    ? transactions?.data?.data
      ?.filter(transaction => {
        const matchesSearchTerm =
          transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.user?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = selectedStatus ? transaction.Transaction_Status === selectedStatus : true
        const matchesType = selectedType ? transaction.Transaction_Type === selectedType : true

        const matchesCourse = selectedCourses.length
          ? transaction.courses.some(course => selectedCourses.some(selected => selected.value === course.id))
          : true

        const matchesDateRange = (() => {
          if (!exportStartDate && !exportEndDate) return true
          const transactionDate = new Date(transaction.Transaction_Date).getTime()
          const start = exportStartDate ? new Date(exportStartDate).setHours(0, 0, 0, 0) : null
          const end = exportEndDate ? new Date(exportEndDate).setHours(23, 59, 59, 999) : null

          return (!start || transactionDate >= start) && (!end || transactionDate <= end)
        })()

        return matchesSearchTerm && matchesStatus && matchesType && matchesCourse && matchesDateRange
      })
      .map(transaction => ({
        ...transaction,
        id: transaction.Transaction_ID
      }))
    : []

  useEffect(() => {
    const calculateSucceededTransactionSum = () => {
      let sum = 0
      filteredTransaction.forEach(transaction => {
        if (transaction.Transaction_Status === 'succeeded') {
          sum += parseFloat(transaction.Amount)
        }
      })
      setSucceededTransactionSum(sum)
    }

    const calculateRefundedTransactionSum = () => {
      let sum = 0
      filteredTransaction.forEach(transaction => {
        if (transaction.Transaction_Status === 'Refund') {
          sum += parseFloat(transaction.Amount)
        }
      })
      setRefundedTransactionSum(sum)
    }

    calculateSucceededTransactionSum()
    calculateRefundedTransactionSum()
  }, [filteredTransaction])

  const exportTransactions = () => {
    let filteredExportTransactions = filteredTransaction

    const processedData = filteredExportTransactions.map(transaction => {
      const { Transaction_ID, Amount, Transaction_Date, Transaction_Status, Transaction_Type, courses, cycles, user } =
        transaction

      const newTransaction = {
        Transaction_ID,
        Amount,
        Transaction_Date: new Date(Transaction_Date).toLocaleDateString(),
        Transaction_Status,
        Transaction_Type,
        CourseTitle: courses.map(course => course.title).join(', '),
        CycleName: cycles.map(cycle => cycle.name).join(', '),
        UserEmail: user.email,
        UserPhone: user.phone
      }

      return newTransaction
    })

    if (processedData.length === 0) {
      return
    }

    const fields = [
      'Transaction_ID',
      'Amount',
      'Transaction_Date',
      'Transaction_Status',
      'Transaction_Type',
      'CourseTitle',
      'CycleName',
      'UserEmail',
      'UserPhone'
    ]

    const parser = new Parser({ fields })
    const csv = parser.parse(processedData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'transactions.csv')
  }

  // ** Hook
  const theme = useTheme()

  const options = {
    colors: [
      theme.palette.success.main,
      hexToRGBA(theme.palette.success.main, 0.7),
      hexToRGBA(theme.palette.success.main, 0.5),
      hexToRGBA(theme.palette.success.main, 0.16)
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
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'warning.main' } }}>
                <Icon icon='tabler:currency-dollar-canadian' fontSize='3rem' />
                <Typography variant='h3' sx={{ color: 'warning.main' }}>
                  {refundedTransactionSum.toFixed(2)}
                </Typography>
              </Box>
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SucceededTransactions