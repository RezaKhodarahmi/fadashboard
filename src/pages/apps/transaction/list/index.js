import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchTransactionData } from 'src/store/apps/transaction'

// ** MUI Imports
import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Grid,
  Paper,
  Chip
} from '@mui/material'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import DatePicker from '@mui/lab/DatePicker'
import { useRouter } from 'next/router'
import { fetchData } from 'src/store/apps/course'
import DateFormat from 'src/utils/dateConverter'
import Link from 'next/link'
import { Search } from '@mui/icons-material'
import { saveAs } from 'file-saver'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { Parser } from 'json2csv'
import { MultiSelect } from 'react-multi-select-component'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components Imports
import SucceededTransactions from 'src/views/ui/cards/statistics/SucceededTransactions'
import RefundedTransactions from 'src/views/ui/cards/statistics/RefundedTransactions'

const TransactionList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transaction)
  const fetchCourses = useSelector(state => state.course)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [exportStartDate, setExportStartDate] = useState(null)
  const [exportEndDate, setExportEndDate] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('succeeded')
  const [selectedType, setSelectedType] = useState('')
  const [succeededTransactionSum, setSucceededTransactionSum] = useState(0)
  const [refundedTransactionSum, setRefundedTransactionSum] = useState(0)
  const [succeededTransactionCount, setSucceededTransactionCount] = useState(0)
  const [refundedTransactionCount, setRefundedTransactionCount] = useState(0)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [courses, setCourses] = useState([])
  const [activeFilter, setActiveFilter] = useState('')

  useEffect(() => {
    console.log(transactions)
  }, [transactions])

  useEffect(() => {
    if (fetchCourses?.data?.data) {
      const courseOptions = fetchCourses?.data?.data?.map(course => ({
        label: course.title,
        value: course.id
      }))
      setCourses(courseOptions)
    }
  }, [fetchCourses])

  const handleStatusChange = event => {
    setSelectedStatus(event.target.value)
  }

  const handleCourseChange = selected => {
    setSelectedCourses(selected)
  }

  const handleTypeChange = event => {
    setSelectedType(event.target.value)
  }

  const handleDateFilter = period => {
    let end = new Date()
    let start = new Date()

    switch (period) {
      case '1w':
        start.setDate(end.getDate() - 7)
        break
      case '4w':
        start.setDate(end.getDate() - 28)
        break
      case '1Y':
        start = new Date(end.getFullYear(), 0, 1)
        break
      case 'MTD':
        start = new Date(end.getFullYear(), end.getMonth(), 1)
        break
      case 'QTD':
        start.setMonth(end.getMonth() - 2)
        start.setDate(1)
        break
      case 'YTD':
        start = new Date(end.getFullYear(), 0, 1)
        break
      case 'ALL':
      default:
        start = null
        end = null
    }

    setExportStartDate(start)
    setExportEndDate(end)
    setActiveFilter(period)
  }

  useEffect(() => {
    dispatch(fetchTransactionData())
    dispatch(fetchData())
  }, [dispatch])

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Transaction?')
    if (confirmation) {
      dispatch(fetchTransactionData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/transaction/edit/' + id)
  }

  const handleStatus = status => {
    switch (status.formattedValue) {
      case 'requires_confirmation':
        return <Chip label='Pending' color='warning' />
      case 'succeeded':
        return <Chip label='Succeeded' color='success' />
      case 'Refund':
        return <Chip label='Refunded' color='error' />
      default:
        return <Chip label='Canceled' color='secondary' />
    }
  }

  const handelUserEmail = user => {
    return (
      <>
        <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.email || 'Unknown'}</Link>
        <span>&nbsp;,&nbsp;</span>
        <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.firstName || 'Unknown'}</Link>
        <span>&nbsp;,&nbsp;</span>
        <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.lastName || 'Unknown'}</Link>
        <span>&nbsp;,&nbsp;</span>
        <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.phone || ''}</Link>
      </>
    )
  }

  const handelEnrolledCourse = course => {
    return course.formattedValue?.map(item => (
      <Link key={item.id} href={`/apps/course/edit/${item.id}`}>
        {item.title + ',' || 'Unknown'}
      </Link>
    ))
  }

  const handelConvertDate = date => {
    return <DateFormat date={date.formattedValue} />
  }

  const columns = [
    { field: 'Transaction_ID', headerName: 'ID', flex: 0.04, minWidth: 50 },
    { field: 'user', headerName: 'User', flex: 0.25, minWidth: 50, renderCell: handelUserEmail },
    { field: 'courses', headerName: 'Course', flex: 0.22, minWidth: 50, renderCell: handelEnrolledCourse },
    { field: 'Amount', headerName: 'Amount', flex: 0.08, minWidth: 50 },
    { field: 'Refunded', headerName: 'Refunded', flex: 0.08, minWidth: 50 },
    { field: 'Transaction_Date', headerName: 'Date', width: 150, renderCell: handelConvertDate },
    { field: 'Transaction_Type', headerName: 'Type', flex: 0.08, minWidth: 50 },
    { field: 'Transaction_Status', headerName: 'Status', flex: 0.1, minWidth: 50, renderCell: handleStatus },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.1,
      minWidth: 100,
      renderCell: params => (
        <Chip
          label='Edit'
          color='warning'
          variant='outlined'
          onClick={() => handleEdit(params.row.id)}
          icon={<Icon icon='tabler:edit' />}
          fontSize={14}
          sx={{ width: '100%' }}
        />
      )
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.1,
      minWidth: 100,
      renderCell: params => (
        <Chip
          label='Delete'
          color='error'
          variant='outlined'
          onClick={() => handleDelete(params.row.id)}
          icon={<Icon icon='tabler:trash' />}
          fontSize={14}
          sx={{ width: '100%' }}
        />
      )
    }
  ]

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
    const calculateSucceededTransactionSumAndCount = () => {
      let sum = 0
      let count = 0
      filteredTransaction.forEach(transaction => {
        if (transaction.Transaction_Status === 'succeeded') {
          sum += parseFloat(transaction.Amount)
          count += 1
        }
        if (
          transaction.Transaction_Status === 'succeeded' &&
          transaction.Refunded != null &&
          transaction.Refunded != 0
        ) {
          sum -= transaction.Refunded
        }
      })
      setSucceededTransactionSum(sum)
      setSucceededTransactionCount(count)
    }

    const calculateRefundedTransactionSum = () => {
      let sum = 0
      let count = 0
      filteredTransaction.forEach(transaction => {
        if (transaction.Transaction_Status === 'Refund') {
          sum += parseFloat(transaction.Amount)
          count += 1
        }
        if (transaction.Refunded != null && transaction.Refunded != 0) {
          sum += parseFloat(transaction.Refunded)
          count += 1
        }
      })
      setRefundedTransactionSum(sum)
      setRefundedTransactionCount(count)
    }

    calculateSucceededTransactionSumAndCount()
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

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid item xs={12} sx={{ marginBottom: 5, overflow: 'visible' }}>
          <Card sx={{ overflow: 'visible' }}>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={4}>
                  <InputLabel>Search</InputLabel>
                  <TextField
                    fullWidth
                    id='searchTerm'
                    name='searchTerm'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder='Search'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton>
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel>Status</InputLabel>
                  <FormControl fullWidth>
                    <Select value={selectedStatus} onChange={handleStatusChange}>
                      <MenuItem value=''>All</MenuItem>
                      <MenuItem value='succeeded'>Succeeded</MenuItem>
                      <MenuItem value='pending'>Pending</MenuItem>
                      <MenuItem value='Refund'>Refunded</MenuItem>
                      <MenuItem value='requires_payment_method'>Requires Payment Method</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel>Transaction Type</InputLabel>
                  <FormControl fullWidth>
                    <Select value={selectedType} onChange={handleTypeChange}>
                      <MenuItem value=''>All</MenuItem>
                      <MenuItem value='Stripe'>Stripe</MenuItem>
                      <MenuItem value='Partially'>Partially</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel>Course</InputLabel>
                  <FormControl fullWidth>
                    <MultiSelect
                      options={courses}
                      value={selectedCourses}
                      onChange={handleCourseChange}
                      labelledBy='Course'
                      hasSelectAll={true}
                      sx={{ zIndex: '5', position: 'relative' }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel>Date From</InputLabel>
                  <DatePicker
                    value={exportStartDate}
                    onChange={setExportStartDate}
                    inputFormat='MM/dd/yyyy'
                    label='Export Start Date'
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel>Date To</InputLabel>
                  <DatePicker
                    value={exportEndDate}
                    onChange={setExportEndDate}
                    inputFormat='MM/dd/yyyy'
                    label='Export End Date'
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </Grid>

                <Grid item xs={2}>
                  <Typography variant='h6'>Quick Filters</Typography>
                </Grid>

                <Grid item xs={1}>
                  <Button
                    fullWidth
                    variant={activeFilter === '1w' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleDateFilter('1w')}
                  >
                    1w
                  </Button>
                </Grid>

                <Grid item xs={1}>
                  <Button
                    fullWidth
                    variant={activeFilter === '4w' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleDateFilter('4w')}
                  >
                    4w
                  </Button>
                </Grid>

                <Grid item xs={1}>
                  <Button
                    fullWidth
                    variant={activeFilter === '1Y' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleDateFilter('1Y')}
                  >
                    1Y
                  </Button>
                </Grid>

                <Grid item xs={1}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'MTD' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleDateFilter('MTD')}
                  >
                    MTD
                  </Button>
                </Grid>

                <Grid item xs={1}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'QTD' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleDateFilter('QTD')}
                  >
                    QTD
                  </Button>
                </Grid>

                <Grid item xs={1}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'YTD' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleDateFilter('YTD')}
                  >
                    YTD
                  </Button>
                </Grid>

                <Grid item xs={1}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'ALL' ? 'contained' : 'outlined'}
                    color='primary'
                    onClick={() => handleDateFilter('ALL')}
                  >
                    ALL
                  </Button>
                </Grid>

                <Grid item xs={1}></Grid>

                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button fullWidth variant='contained' color='primary' onClick={exportTransactions}>
                    Export
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid container spacing={5} sx={{ marginBottom: 5 }}>
          <Grid item xs={12} md={6}>
            <SucceededTransactions total={succeededTransactionSum.toFixed(2)} count={succeededTransactionCount} />
          </Grid>

          <Grid item xs={12} md={6}>
            <RefundedTransactions total={refundedTransactionSum.toFixed(2)} count={refundedTransactionCount} />
          </Grid>
        </Grid>

        <Card>
          <CardHeader title='Transaction List' />
          <Box sx={{ height: 650 }}>
            <DataGrid
              rows={filteredTransaction}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              pagination
            />
          </Box>
        </Card>
      </LocalizationProvider>
    </>
  )
}

export default TransactionList
