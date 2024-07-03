import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchEXData, deleteEXAppointment } from 'src/store/apps/appointment'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { format } from 'date-fns'
import { Parser } from 'json2csv'
import { saveAs } from 'file-saver'

const EDAppointmentList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const appointment = useSelector(state => state.appointment)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [filteredAppointment, setFilteredAppointment] = useState([])

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this appointment?')
    if (confirmation) {
      dispatch(deleteEXAppointment(id))
      dispatch(fetchEXData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/appointment/edit/' + id)
  }

  const handleShowUser = params => {
    const user = params?.row?.user

    return <Link href={`/user/edit/${user.id}`}>{user.firstName + ' ' + user.lastName}</Link>
  }

  const handleShowEmployee = params => {
    const employee = params?.row?.employees

    return <Link href={`/user/edit/${employee.id}`}>{employee.firstName + ' ' + employee.lastName}</Link>
  }

  const formatDate = date => format(new Date(date), 'yyyy-MM-dd')
  const formatTime = time => format(new Date(`1970-01-01T${time}Z`), 'HH:mm:ss')

  useEffect(() => {
    dispatch(fetchEXData())
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(appointment?.data?.data)) {

      const filtered = appointment.data.data.filter(appoint => {
        const searchTermMatch =
          appoint.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appoint.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())

          return searchTermMatch
      })
      setFilteredAppointment(filtered)
    }
  }, [appointment, searchTerm])

  const exportToCSV = () => {
    const fields = ['id', 'user', 'phone', 'employee', 'time', 'date']
    const opts = { fields }
    const parser = new Parser(opts)

    const csvData = filteredAppointment.map(row => ({
      id: row.id,
      user: `${row.user.firstName} ${row.user.lastName}`,
      phone: row.user.phone,
      employee: `${row.employees.firstName} ${row.employees.lastName}`,
      time: formatTime(row.time),
      date: formatDate(row.date)
    }))

    const csv = parser.parse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'EXappointments.csv')
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'user', headerName: 'User', width: 200, renderCell: handleShowUser },
    { field: 'phone', headerName: 'Phone', width: 150, valueGetter: params => params.row.user.phone },
    { field: 'employee', headerName: 'Employee', width: 200, renderCell: handleShowEmployee },
    { field: 'time', headerName: 'Time', width: 100, valueGetter: params => formatTime(params.row.time) },
    { field: 'date', headerName: 'Date', width: 150, valueGetter: params => formatDate(params.row.date) },
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

  return (
    <div style={{ height: 600, width: '100%' }}>
      <TextField
        id='search'
        variant='outlined'
        label='Search by email or first name'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <Button onClick={exportToCSV}>Export Appointments</Button>

      {filteredAppointment.length > 0 ? (
        <DataGrid
          rows={filteredAppointment}
          columns={columns}
          pageSize={Number(pageSize)}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
        />
      ) : (
        <p>No appointments found</p>
      )}
    </div>
  )
}

export default EDAppointmentList
