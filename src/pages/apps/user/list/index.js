import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchData, deleteUser } from 'src/store/apps/user'
import { TextField, Select, MenuItem, InputLabel } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import BASE_URL from 'src/api/BASE_URL'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'

const UserList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const users = useSelector(state => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const [serchUserRole, setSerchUserRole] = useState('0')
  const [pageSize, setPageSize] = useState(10)
  const token = localStorage.getItem('token')

  const vipExport = () => {
    const token = localStorage.getItem('accessToken')
    const URL = `${BASE_URL}/users/download/vip?Authorization=Bearer+${token}`

    // Create a new tab and start loading the URL
    const newTab = window.open()

    // Create a form element
    const form = document.createElement('form')
    form.method = 'GET'
    form.action = URL
    form.target = newTab ? newTab.name : '_blank'

    // Create an input element to hold the bearer token
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'Authorization'
    input.value = `Bearer ${token}`
    form.appendChild(input)

    // Append the form to the body and submit it
    document.body.appendChild(form)
    form.submit()

    // Remove the form from the body after submission
    document.body.removeChild(form)
  }

  const usersExport = () => {
    const token = localStorage.getItem('accessToken')
    const URL = `${BASE_URL}/users/download/all?Authorization=Bearer+${token}`

    // Create a new tab and start loading the URL
    const newTab = window.open()

    // Create a form element
    const form = document.createElement('form')
    form.method = 'GET'
    form.action = URL
    form.target = newTab ? newTab.name : '_blank'

    // Create an input element to hold the bearer token
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'Authorization'
    input.value = `Bearer ${token}`
    form.appendChild(input)

    // Append the form to the body and submit it
    document.body.appendChild(form)
    form.submit()

    // Remove the form from the body after submission
    document.body.removeChild(form)
  }

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this User?')
    if (confirmation) {
      dispatch(deleteUser(id))
      dispatch(fetchData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/user/edit/' + id)
  }

  const handelRole = role => {
    switch (role.formattedValue) {
      case '10000':
        return 'Administrator'
        break
      case '8000':
        return 'Editor'
        break
      case '6000':
        return 'Financial manager'
        break
      case '4000':
        return 'Blog manager'
        break
      case '2000':
        return 'Customer'
        break
      case '1000':
        return 'Customer'
        break
      default:
        return 'client'
        break
    }
  }

  const handelStatus = status => {
    switch (status.formattedValue) {
      case '1':
        return 'Active'
        break
      case '0':
        return 'Inactive'
        break
      default:
        return 'Inactive'
        break
    }
  }

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 100 },
    { field: 'lastName', headerName: 'Last Name', width: 100 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'role', headerName: 'Role', width: 70, renderCell: handelRole },
    { field: 'vip', headerName: 'VIP', flex: 0.05, minWidth: 50 },
    { field: 'status', headerName: 'Status', flex: 0.12, minWidth: 50, renderCell: handelStatus },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.05,
      renderCell: params => (
        <Button color='success' variant='contained' onClick={() => handleEdit(params.row.id)}>
          Edit
        </Button>
      )
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.05,
      renderCell: params => (
        <Button color='warning' variant='contained' onClick={() => handleDelete(params.row.id)}>
          Delete
        </Button>
      )
    }
  ]

  const filteredUsers = Array.isArray(users?.data?.data)
    ? users?.data?.data?.filter(user => {
        const searchTermMatch =
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.phone?.toLowerCase().includes(searchTerm.toLowerCase())

        if (serchUserRole === '0') {
          const searchRoleMatch = serchUserRole

          return searchTermMatch && searchRoleMatch
        } else {
          const searchRoleMatch = user.role === serchUserRole

          return searchTermMatch && searchRoleMatch
        }
      })
    : []

  return (
    <>
      {filteredUsers ? (
        <Card>
          <CardHeader 
            title='All Users' 
            action={
              <div>
                <Select
                  labelId='user-Role-select'
                  id='user-Role-select'
                  defaultValue={'0'}
                  onChange={e => setSerchUserRole(e.target.value)}
                >
                  <MenuItem value={'0'}>All</MenuItem>
                  <MenuItem value={'2000'}>Customer</MenuItem>
                  <MenuItem value={'8000'}>Editor</MenuItem>
                  <MenuItem value={'6000'}>Financial manager</MenuItem>
                  <MenuItem value={'4000'}>Blog manager</MenuItem>
                  <MenuItem value={'10000'}>Administrator</MenuItem>
                </Select>
                <Button onClick={vipExport}>Export VIP</Button>
                <Button onClick={usersExport}>Export All</Button>

                <TextField
                  id='search'
                  variant='outlined'
                  label='Search'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            }
          />
          <Box sx={{ height: 650 }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSize={Number(pageSize)}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              checkboxSelection
            />
          </Box>
        </Card>
      ) : null}
    </>
  )
}

export default UserList
