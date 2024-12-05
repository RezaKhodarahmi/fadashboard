import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchZoomLinks } from 'src/store/apps/zoom-links'
import { Box, Card, Button } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy' // MUI Icon for copy

// Utility functions for formatting data
const formatDate = date => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const copyToClipboard = text => {
  navigator.clipboard.writeText(text).then(
    () => {
      alert('Link copied to clipboard!')
    },
    err => {
      console.error('Failed to copy: ', err)
    }
  )
}

const renderLinkWithCopyButton = zoomId => {
  const fullLink = `https://zoom.us/j/${zoomId}`
  return (
    <Box display='flex' alignItems='center' gap={1}>
      <a href={fullLink} target='_blank' rel='noopener noreferrer'>
        {zoomId}
      </a>
      <Button size='small' variant='outlined' startIcon={<ContentCopyIcon />} onClick={() => copyToClipboard(fullLink)}>
        Copy
      </Button>
    </Box>
  )
}

const UserList = () => {
  const dispatch = useDispatch()
  const links = useSelector(state => state.zoomLinks)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    dispatch(fetchZoomLinks())
  }, [dispatch])

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.1, minWidth: 50 },
    { field: 'courseTitle', headerName: 'Course Title', flex: 0.3, minWidth: 150 },
    {
      field: 'courseCycle',
      headerName: 'Cycle Name',
      flex: 0.3,
      minWidth: 150,
      valueGetter: params => params.row.courseCycle?.name || 'N/A'
    },
    {
      field: 'zoomId',
      headerName: 'Zoom Link',
      flex: 0.3,
      minWidth: 300,
      renderCell: params => renderLinkWithCopyButton(params.row.zoomId)
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 0.3,
      minWidth: 200,
      valueGetter: params => formatDate(params.row.createdAt)
    }
  ]

  return (
    <>
      {links?.data?.data ? (
        <Card>
          <Box sx={{ height: 650 }}>
            <DataGrid
              rows={links?.data?.data.map(link => ({
                ...link,
                id: link.id // Ensure each row has a unique `id`
              }))}
              columns={columns}
              pageSize={Number(pageSize)}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        </Card>
      ) : null}
    </>
  )
}

export default UserList
