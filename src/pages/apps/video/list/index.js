import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchData, deleteVideo } from 'src/store/apps/video'
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
    }
  }

  const handleEdit = id => {
    router.push('/apps/video/edit/' + id)
  }

  const handleEnroll = needEnroll => {
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
  }, [])

  const renderStatusCell = (params) => {
    const { value } = params;
    const statusText = handleEnroll(value);
  
    return (
      <div>
        {statusText && (
          <Chip label={ value == '1' ? 'Need Enroll' : value == '0' ? 'Free' : value == '2' ? 'Pending Review' : 'Pending Review' } color={ value == '1' ? 'primary' : value == '0' ? 'info' : value == '2' ? 'warning' : 'secondary'} sx={{ width: '100%' } } />
        )}
      </div>
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.01, minWidth: 50 },
    { field: 'title', headerName: 'Title', flex: 0.3, minWidth: 50 },
    { field: 'url', headerName: 'url', flex: 0.3, minWidth: 50 },
    { field: 'createdAt', headerName: 'Created At', flex: 0.25, minWidth: 50 },
    { field: 'needEnroll', headerName: 'Enroll Status', flex: 0.15, minWidth: 50, renderCell: renderStatusCell },
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
            onClick={()=> handleDelete(params.row.id)}
            icon={<Icon icon='tabler:trash' />}
            fontSize={14}
            sx={{ width: '100%' }}
        />
      )
    },
  ]

  const filteredVideos = Array.isArray(videos?.data?.data)
    ? videos?.data?.data?.filter(video => {
        const searchTermMatch =
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video?.slug?.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  return (
    <>
      <Card>
        <CardHeader 
          title='All Recorded Videos' 
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
        </Box>
      </Card>
    </>
  )
}

export default UserList
