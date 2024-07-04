import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchPostsData, deletePost } from 'src/store/apps/post'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CourseList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: posts } = useSelector(state => state.posts)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(fetchPostsData(page + 1, pageSize, searchTerm))
  }, [dispatch, page, pageSize, searchTerm])

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Post?')
    if (confirmation) {
      dispatch(deletePost(id))
      dispatch(fetchPostsData(page + 1, pageSize, searchTerm))
    }
  }

  const handleEdit = id => {
    router.push('/apps/post/edit/' + id)
  }

  const handleStatus = status => {
    switch (status.formattedValue) {
      case 1:
        return 'Published'
      case 0:
        return 'Draft'
      case 2:
        return 'Pending review'
      default:
        return 'Pending review'
    }
  }

  const handleDate = createdAt => {
    const date = new Date(createdAt.formattedValue)

    const formattedDate = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(
      -2
    )}/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`

    return formattedDate
  }

  const renderStatusCell = params => {
    const { value } = params
    const statusText = handleStatus(value)

    return (
      <div>
        {statusText && (
          <Chip
            label={
              value == '1' ? 'Published' : value == '0' ? 'Draft' : value == '2' ? 'Pending Review' : 'Pending Review'
            }
            color={value == '1' ? 'primary' : value == '0' ? 'info' : value == '2' ? 'warning' : 'secondary'}
            sx={{ width: '100%' }}
          />
        )}
      </div>
    )
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.01, minWidth: 50 },
    { field: 'title', headerName: 'Title', flex: 0.3, minWidth: 50 },
    { field: 'slug', headerName: 'Slug', flex: 0.3, minWidth: 50 },
    { field: 'createdAt', headerName: 'Created At', flex: 0.15, minWidth: 50, renderCell: handleDate },
    { field: 'updatedAt', headerName: 'Modified At', flex: 0.15, minWidth: 50, renderCell: handleDate },
    { field: 'published', headerName: 'Status', flex: 0.12, minWidth: 50, renderCell: renderStatusCell },
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
      flex: 0.12,
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

  return (
    <>
      {posts?.data ? (
        <Card>
          <CardHeader
            title='All Posts'
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
              rows={posts?.data}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              checkboxSelection
              paginationMode='server'
              page={page}
              onPageChange={newPage => setPage(newPage)}
              rowCount={posts?.total}
              pagination
            />
          </Box>
        </Card>
      ) : null}
    </>
  )
}

export default CourseList
