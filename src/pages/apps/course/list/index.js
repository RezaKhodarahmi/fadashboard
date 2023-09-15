import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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

  const handelType = type => {
    switch (type.formattedValue) {
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
    { field: 'title', headerName: 'Title', width: 100 },
    { field: 'slug', headerName: 'Slug', width: 150 },
    { field: 'keywords', headerName: 'Keywords', width: 150 },
    { field: 'type', headerName: 'Type', width: 70, renderCell: handelType },
    { field: 'status', headerName: 'Status', width: 90, renderCell: handelStatus },
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

  const filteredUsers = Array.isArray(courses?.data?.data)
    ? courses?.data?.data?.filter(course => {
        const searchTermMatch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.slug.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  return (
    <div style={{ height: 400, width: '100%' }}>
      <TextField
        id='search'
        variant='outlined'
        label='Search by title or slug'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {filteredUsers ? (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={Number(pageSize)}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
        />
      ) : null}
    </div>
  )
}

export default UserList
