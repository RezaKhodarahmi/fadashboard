import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchTransactionData } from 'src/store/apps/transaction'
import BASE_URL from 'src/api/BASE_URL'

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
  const [currentPage, setCurrentPage] = useState(1)
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
  }, [])

  useEffect(() => {
    const fetchTransactions = () => {
      dispatch(
        fetchTransactionData(
          currentPage,
          pageSize,
          searchTerm,
          selectedStatus,
          selectedType,
          exportStartDate,
          exportEndDate
        )
      )
    }

    fetchTransactions()
  }, [dispatch, currentPage, pageSize, searchTerm, selectedStatus, selectedType, exportStartDate, exportEndDate])

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Transaction?')
    if (confirmation) {
      dispatch(
        fetchTransactionData(
          currentPage,
          pageSize,
          searchTerm,
          selectedStatus,
          selectedType,
          exportStartDate,
          exportEndDate
        )
      )
    }
  }

  const handleEdit = id => {
    console.log(id)
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

  useEffect(() => {
    if (transactions) {
      setSucceededTransactionSum(transactions?.data?.succeededSum)
      setSucceededTransactionCount(transactions?.data?.succeededCount)
      setRefundedTransactionSum(transactions?.data?.refundedSum)
      setRefundedTransactionCount(transactions?.data?.refundedCount)
    }
  }, [transactions])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(
        fetchTransactionData(
          currentPage,
          pageSize,
          searchTerm,
          selectedStatus,
          selectedType,
          exportStartDate,
          exportEndDate
        )
      )
    }, 500) // Debounce delay: 500ms

    return () => clearTimeout(delayDebounce) // Cleanup on unmount or new search
  }, [dispatch, currentPage, pageSize, searchTerm, selectedStatus, selectedType, exportStartDate, exportEndDate])

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
          onClick={() => handleEdit(params.row.userId)}
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
  const token = window.localStorage.getItem('accessToken')
  const filteredTransaction = Array.isArray(transactions?.data?.data) ? transactions.data.data : []

  const exportTransactions = async () => {
    try {
      const queryParams = new URLSearchParams({
        searchTerm,
        selectedStatus,
        selectedType,
        exportStartDate: exportStartDate?.toISOString(),
        exportEndDate: exportEndDate?.toISOString()
      }).toString()

      const response = await fetch(`${BASE_URL}/transaction/csv/export?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}` // Replace with your auth logic
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'transactions.csv')
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      } else {
        console.error('Failed to export CSV')
      }
    } catch (error) {
      console.error('Error exporting transactions:', error)
    }
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
                      <MenuItem value='E-Transfer'>E-Transfer</MenuItem>
                      <MenuItem value='Iran'>Iran</MenuItem>
                      <MenuItem value='Manual'>Manual</MenuItem>
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
            <SucceededTransactions
              total={(succeededTransactionSum || 0).toFixed(2)}
              count={succeededTransactionCount || 0}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RefundedTransactions
              total={(refundedTransactionSum || 0).toFixed(2)}
              count={refundedTransactionCount || 0}
            />
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
              pagination
              getRowId={row => row.Transaction_ID}
              paginationMode='server'
              rowCount={transactions?.data?.total || 0} // Set total rows from the API response
              onPageChange={newPage => setCurrentPage(newPage + 1)} // Increment page for zero-based index
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Box>
        </Card>
      </LocalizationProvider>
    </>
  )
}

export default TransactionList
