import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchData, deleteUser } from 'src/store/apps/user'
import { TextField, Select, MenuItem } from '@mui/material'
import { adminLogin } from 'src/store/apps/admin-login'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import BASE_URL from 'src/api/BASE_URL'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const UserList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const users = useSelector(state => state.user)
  const adminLoginRes = useSelector(state => state.adminLogin)
  const [searchTerm, setSearchTerm] = useState('')
  const [serchUserRole, setSerchUserRole] = useState('0')
  const [pageSize, setPageSize] = useState(10)
  const token = localStorage.getItem('token')

  const vipExport = () => {
    const token = localStorage.getItem('accessToken')
    const URL = `${BASE_URL}/users/download/vip?Authorization=Bearer+${token}`

    const newTab = window.open()

    const form = document.createElement('form')
    form.method = 'GET'
    form.action = URL
    form.target = newTab ? newTab.name : '_blank'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'Authorization'
    input.value = `Bearer ${token}`
    form.appendChild(input)

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  const usersExport = () => {
    const token = localStorage.getItem('accessToken')
    const URL = `${BASE_URL}/users/download/all?Authorization=Bearer+${token}`

    const newTab = window.open()

    const form = document.createElement('form')
    form.method = 'GET'
    form.action = URL
    form.target = newTab ? newTab.name : '_blank'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'Authorization'
    input.value = `Bearer ${token}`
    form.appendChild(input)

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this User?')
    if (confirmation) {
      dispatch(deleteUser(id))
      dispatch(fetchData())
    }
  }

  useEffect(() => {
    if (adminLoginRes?.data?.data) {
      const { accessToken, refreshToken } = adminLoginRes.data
      const e = window.open('http://localhost:8585', '_blank')

      if (newWindow) {
        const handleMessage = event => {
          if (event.origin === 'http://localhost:8585' && event.data === 'ready') {
            newWindow.postMessage({ accessToken, refreshToken }, 'http://localhost:8585')
            window.removeEventListener('message', handleMessage)
          }
        }

        window.addEventListener('message', handleMessage)
      }
    }
  }, [adminLoginRes])

  const handleLogin = email => {
    dispatch(adminLogin({ email }))
  }

  const handleEdit = id => {
    router.push('/apps/user/edit/' + id)
  }

  const handleRole = role => {
    switch (role.formattedValue) {
      case '10000':
        return 'Administrator'
      case '8000':
        return 'Editor'
      case '6000':
        return 'Financial manager'
      case '4000':
        return 'Blog manager'
      case '2000':
      case '1000':
        return 'Customer'
      default:
        return 'client'
    }
  }

  const handleStatus = status => {
    switch (status.formattedValue) {
      case '1':
        return 'Active'
      case '0':
      default:
        return 'Inactive'
    }
  }

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  const renderStatusCell = params => {
    const { value } = params
    const statusText = handleStatus(value)

    return (
      <div>
        {statusText && (
          <Chip
            label={value == '1' ? 'Active' : 'Inactive'}
            color={value == '1' ? 'success' : 'secondary'}
            sx={{ width: '100%' }}
          />
        )}
      </div>
    )
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.03, minWidth: 50 },
    { field: 'firstName', headerName: 'First Name', flex: 0.06, minWidth: 50 },
    { field: 'lastName', headerName: 'Last Name', flex: 0.06, minWidth: 50 },
    { field: 'email', headerName: 'Email', flex: 0.1, minWidth: 50 },
    { field: 'phone', headerName: 'Phone', flex: 0.08, minWidth: 50 },
    { field: 'vip', headerName: 'VIP', flex: 0.05, minWidth: 50 },
    { field: 'role', headerName: 'Role', flex: 0.05, minWidth: 50, renderCell: handleRole },
    { field: 'status', headerName: 'Status', flex: 0.05, minWidth: 50, renderCell: renderStatusCell },
    {
      field: 'login',
      headerName: 'Login',
      flex: 0.06,
      minWidth: 100,
      renderCell: params => (
        <Button variant='contained' color='primary' onClick={() => handleLogin(params.row.email)}>
          Login to Account
        </Button>
      )
    },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.06,
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
      flex: 0.06,
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

  const filteredUsers = Array.isArray(users?.data?.data)
    ? users?.data?.data?.filter(user => {
        const searchTermMatch =
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.phone?.toLowerCase().includes(searchTerm.toLowerCase())

        if (serchUserRole === '0') {
          return searchTermMatch
        } else {
          return searchTermMatch && user.role === serchUserRole
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
