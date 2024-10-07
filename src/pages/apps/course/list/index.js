import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'
import { fetchData, deleteCourse } from 'src/store/apps/course'
import { TextField, Select, MenuItem, InputLabel } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const UserList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const courses = useSelector(state => state.course)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Course?')
    if (confirmation) {
      dispatch(deleteCourse(id))
      dispatch(fetchData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/course/edit/' + id)
  }

  const handleType = type => {
    switch (type?.formattedValue) {
      case '1':
        return 'Online'
        break
      case '0':
        return 'Recorded'
        break
      default:
        return 'Online'
        break
    }
  }

  const handleStatus = status => {
    switch (status?.formattedValue) {
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

  const renderTypeCell = (params) => {
    const { value } = params;
    const statusText = handleType(value);

    return (
      <div>
        {statusText && (
          <Chip
              label={value === '1' ? 'Online' : 'Recorded'}
              color={value === '1' ? 'success' : 'error'}
              variant='outlined'
              icon={<Icon icon={value === '1' ? 'tabler:circle-dot-filled' : 'tabler:video'} fontSize={20} />}
          />
        )}
      </div>
    );
  };

  const renderStatusCell = (params) => {
    const { value } = params;
    const statusText = handleStatus(value);

    return (
      <div>
        {statusText && (
          <Chip label={value === '1' ? 'Published' : 'Not Published'} color={value === '1' ? 'primary' : 'default'} />
        )}
      </div>
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.01, minWidth: 50 },
    { field: 'title', headerName: 'Title', flex: 0.5, minWidth: 200 },
    { field: 'slug', headerName: 'Slug', flex: 0.4, minWidth: 150 },
    { field: 'type', headerName: 'Type', flex: 0.15, minWidth: 70, renderCell: renderTypeCell },
    { field: 'status', headerName: 'Status', flex: 0.15, minWidth: 90 ,renderCell: renderStatusCell },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.12,
      minWidth: 100,
      renderCell: params => (
        <Chip
          label='Edit'
          color='warning'
          variant='outlined'
          onClick={()=> handleEdit(params.row.id)}
          icon={<Icon icon='tabler:edit' />}
          fontSize={14}
        />
      )
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.15,
      minWidth: 100,
      renderCell: params => (
        <Chip
            label='Delete'
            color='error'
            variant='outlined'
            onClick={()=> handleDelete(params.row.id)}
            icon={<Icon icon='tabler:trash' />}
            fontSize={14}
        />
      )
    }
  ]

  const filteredUsers = Array.isArray(courses?.data?.data)
    ? courses?.data?.data?.filter(course => {
        const searchTermMatch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.slug.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  return (
    <>
      {filteredUsers ? (
        <Card>
          <CardHeader
            title='All Courses'
            action={
              <div>
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
