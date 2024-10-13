import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchEnrollmentData, deleteEnrollment } from 'src/store/apps/enrollment'
import { TextField, Button, InputAdornment, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import DateFormat from 'src/utils/dateConverter'
import Link from 'next/link'
import { Search } from '@mui/icons-material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
    const confirmation = window.confirm('Are you sure you want to delete this Enrollment?')
    if (confirmation) {
      dispatch(deleteEnrollment(id))
    }
  }

  const handleEdit = id => {
    router.push('/apps/transaction/edit/' + id)
  }

  const handleStatus = status => {
    switch (status.formattedValue) {
      case 0:
        return (
          <span className='warning-label' style={{ background: '#E08C3B', padding: '5px', borderRadius: '5px' }}>
            pending
          </span>
        )
      case 1:
        return (
          <span
            className='success-label'
            color='success'
            style={{ background: '#28C76F', padding: '5px', borderRadius: '5px' }}
          >
            Active
          </span>
        )
      default:
        return (
          <span className='danger-label' style={{ background: '#808080', padding: '5px', borderRadius: '5px' }}>
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

  const handelEnrolledCycle = cycle => {
    return <h5>{cycle.value.name || 'Unknown'}</h5>
  }

  const handelEnrolledStart = date => {
    return <DateFormat date={date.value} />
  }

  const handelEnrolledEnd = date => {
    return <DateFormat date={date.value} />
  }

  const handelTransaction = transaction => {
    if (transaction.value) {
      return <Link href={`/apps/transaction/edit/${transaction.value}`}>{transaction.value + '' || 'Unknown'}</Link>
    } else {
      return 'Manual'
    }
  }

  const renderStatusCell = params => {
    const { value } = params
    const statusText = handleStatus(value)

    return (
      <div>
        {statusText && (
          <Chip
            label={
              value == '1' ? 'Accepted' : value == '0' ? 'Pending' : value == '2' ? 'Pending Review' : 'Pending Review'
            }
            color={value == '1' ? 'success' : value == '0' ? 'warning' : value == '2' ? 'warning' : 'secondary'}
            sx={{ width: '100%' }}
          />
        )}
      </div>
    )
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.05, minWidth: 50 },
    { field: 'user', headerName: 'User', flex: 0.2, minWidth: 50, renderCell: handelUserEmail },
    { field: 'course', headerName: 'Course', flex: 0.2, minWidth: 60, renderCell: handelEnrolledCourse },
    { field: 'cycle', headerName: 'Cycle', flex: 0.2, minWidth: 20, renderCell: handelEnrolledCycle },
    { field: 'enrollmentDate', headerName: 'Start', flex: 0.2, minWidth: 20, renderCell: handelEnrolledStart },
    { field: 'completionDate', headerName: 'End', flex: 0.2, minWidth: 20, renderCell: handelEnrolledEnd },
    { field: 'status', headerName: 'Status', flex: 0.06, minWidth: 50, renderCell: renderStatusCell },
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

  const filteredEnrollment = Array.isArray(enrollments?.data?.data)
    ? enrollments?.data?.data
        ?.filter(
          enrollment =>
            enrollment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment?.user?.phone?.toLowerCase().includes(searchItinerary.toLowerCase())
        )
        .map(enrollment => ({
          ...enrollment,
          id: enrollment.id // This ensures the row uses the enrollment id
        }))
    : []

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <Card>
          <CardHeader
            title='All Enrollments'
            action={
              <div>
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
              </div>
            }
          />
          <Box sx={{ height: 650 }}>
            <DataGrid
              rows={filteredEnrollment}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              pagination
            />
          </Box>
        </Card>
      </>
    </LocalizationProvider>
  )
}

export default EnrollmentList
