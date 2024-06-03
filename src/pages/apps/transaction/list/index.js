import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchTransactionData } from 'src/store/apps/transaction'
import { TextField, Button, InputAdornment, IconButton, Box } from '@mui/material'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import DatePicker from '@mui/lab/DatePicker'
import { useRouter } from 'next/router'
import DateFormat from 'src/utils/dateConverter'
import Link from 'next/link'
import { Search } from '@mui/icons-material'
import { saveAs } from 'file-saver'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { Parser } from 'json2csv'

const TransactionList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transaction)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [exportStartDate, setExportStartDate] = useState(null)
  const [exportEndDate, setExportEndDate] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [succeededTransactionSum, setSucceededTransactionSum] = useState(0)

  const handleStatusChange = event => {
    setSelectedStatus(event.target.value)
  }

  const handleTypeChange = event => {
    setSelectedType(event.target.value)
  }

  useEffect(() => {
    dispatch(fetchTransactionData())
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

  const handelStatus = status => {
    switch (status.formattedValue) {
      case 'requires_confirmation':
        return (
          <span className='warning-label' style={{ background: '#E08C3B' }}>
            Pending
          </span>
        )
      case 'succeeded':
        return (
          <span className='success-label' color='success' style={{ background: '#28C76F' }}>
            Succeeded
          </span>
        )
      default:
        return (
          <span className='danger-label' style={{ background: '#808080' }}>
            Canceled
          </span>
        )
    }
  }

  const handelUserEmail = user => {
    return (
      <>
        <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.email || 'Unknown'}</Link>
        <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.firstName || 'Unknown'}</Link>
        <span>,</span>
        <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.lastName || 'Unknown'}</Link>
        <span>,</span>
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
    { field: 'Transaction_ID', headerName: 'ID', width: 10 },
    { field: 'user', headerName: 'User', width: 150, renderCell: handelUserEmail },
    { field: 'courses', headerName: 'Course', width: 250, renderCell: handelEnrolledCourse },
    { field: 'Amount', headerName: 'Amount', width: 70 },
    { field: 'Transaction_Status', headerName: 'Status', renderCell: handelStatus },
    { field: 'Transaction_Type', headerName: 'Type', width: 100 },
    { field: 'Transaction_Date', headerName: 'Date', width: 150, renderCell: handelConvertDate },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      renderCell: params => (
        <Button color='success' variant='contained' onClick={() => handleEdit(params.row.id)}>
          Edit
        </Button>
      )
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      renderCell: params => (
        <Button color='warning' variant='contained' onClick={() => handleDelete(params.row.id)}>
          Delete
        </Button>
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

          const matchesDateRange = (() => {
            if (!exportStartDate && !exportEndDate) return true
            const transactionDate = new Date(transaction.Transaction_Date).getTime()
            const start = exportStartDate ? new Date(exportStartDate).setHours(0, 0, 0, 0) : null
            const end = exportEndDate ? new Date(exportEndDate).setHours(23, 59, 59, 999) : null

            return (!start || transactionDate >= start) && (!end || transactionDate <= end)
          })()

          return matchesSearchTerm && matchesStatus && matchesType && matchesDateRange
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

    calculateSucceededTransactionSum()
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <TextField
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

        <FormControl style={{ minWidth: 200, margin: '0 10px' }}>
          <InputLabel>Status</InputLabel>
          <Select value={selectedStatus} onChange={handleStatusChange}>
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='succeeded'>Succeeded</MenuItem>
            <MenuItem value='requires_payment_method'>requires_payment_method</MenuItem>
            <MenuItem value='pending'>pending</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 200, margin: '0 10px' }}>
          <InputLabel>Transaction Type</InputLabel>
          <Select value={selectedType} onChange={handleTypeChange}>
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='Partially'>Partially</MenuItem>
            <MenuItem value='Stripe'>Stripe</MenuItem>
          </Select>
        </FormControl>
        <DatePicker
          value={exportStartDate}
          onChange={setExportStartDate}
          inputFormat='MM/dd/yyyy'
          label='Export Start Date'
          renderInput={params => <TextField {...params} />}
        />

        <DatePicker
          value={exportEndDate}
          onChange={setExportEndDate}
          inputFormat='MM/dd/yyyy'
          label='Export End Date'
          renderInput={params => <TextField {...params} />}
        />

        <Button onClick={exportTransactions}>Export</Button>
        <Box sx={{ marginTop: 2, padding: 2, backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h3>Succeeded Transactions Sum: ${succeededTransactionSum.toFixed(2)}</h3>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredTransaction}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            pagination
          />
        </div>
      </>
    </LocalizationProvider>
  )
}

export default TransactionList
