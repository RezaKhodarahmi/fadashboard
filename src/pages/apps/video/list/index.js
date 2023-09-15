import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchData, deleteVideo } from 'src/store/apps/video'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const UserList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const videos = useSelector(state => state.video)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Video?')
    if (confirmation) {
      dispatch(deleteVideo(id))
      dispatch(fetchData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/video/edit/' + id)
  }

  const handelEnroll = needEnroll => {
    switch (needEnroll.formattedValue) {
      case '1':
        return 'Need Enroll'
        break
      case '0':
        return 'Free'
        break
      default:
        return 'Free'
        break
    }
  }

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 100 },
    { field: 'url', headerName: 'url', width: 150 },
    { field: 'needEnroll', headerName: 'needEnroll', width: 70, renderCell: handelEnroll },
    { field: 'createdAt', headerName: 'createdAt', width: 100 },
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

  const filteredVideos = Array.isArray(videos?.data?.data)
    ? videos?.data?.data?.filter(video => {
        const searchTermMatch =
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.slug.toLowerCase().includes(searchTerm.toLowerCase())

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

      {filteredVideos ? (
        <DataGrid
          rows={filteredVideos}
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
