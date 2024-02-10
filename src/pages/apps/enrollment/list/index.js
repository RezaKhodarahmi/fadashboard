import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchEnrollmentData } from 'src/store/apps/enrollment'
import { TextField, Button, InputAdornment, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import DateFormat from 'src/utils/dateConverter'
import Link from 'next/link'
import { Search } from '@mui/icons-material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

const EnrollmentList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const enrollments = useSelector(state => state.enrollment)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    dispatch(fetchEnrollmentData())
  }, [dispatch])

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Order?')
    if (confirmation) {
      dispatch(fetchEnrollmentData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/transaction/edit/' + id)
  }

  const handelStatus = status => {
    switch (status.formattedValue) {
      case '0':
        return (
          <span className='warning-label' style={{ background: '#E08C3B' }}>
            Canceled
          </span>
        )
      case '1':
        return (
          <span className='success-label' color='success' style={{ background: '#28C76F' }}>
            Active
          </span>
        )
      case '3':
        return (
          <span className='success-label' color='success' style={{ background: '#808080' }}>
            Pending
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
    return <Link href={`/apps/user/edit/${user.formattedValue?.id}`}>{user.formattedValue?.email || 'Unknown'}</Link>
  }

  const handelEnrolledCourse = course => {
    return <Link href={`/apps/course/edit/${course.value.id}`}>{course.value.title + ',' || 'Unknown'}</Link>
  }

  const handelConvertDate = date => {
    return <DateFormat date={date.formattedValue} />
  }

  const handelTransaction = transaction => {
    switch (transaction.value.Transaction_Type) {
      case 'Stripe':
        return 'Stripe'
        break
      case 'partially':
        return 'Partially'
        break
      default:
        return 'Manually'
        break
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 10 },
    { field: 'user', headerName: 'User', width: 150, renderCell: handelUserEmail },
    { field: 'course', headerName: 'Course', width: 250, renderCell: handelEnrolledCourse },
    { field: 'status', headerName: 'Status', renderCell: handelStatus },
    { field: 'transaction', headerName: 'Type', width: 100, renderCell: handelTransaction },
    { field: 'enrollmentDate', headerName: 'Date', width: 150, renderCell: handelConvertDate },
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

  const filteredEnrollment = Array.isArray(enrollments?.data?.data)
    ? enrollments?.data?.data
        ?.filter(enrollment => enrollment.user.email.includes(searchTerm) || enrollment.user.phone.includes(searchTerm))
        .map(enrollment => ({
          ...enrollment,
          id: enrollment.Transaction_ID
        }))
    : []

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

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredEnrollment}
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

export default EnrollmentList
