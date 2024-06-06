import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchPostsData, deletePost } from 'src/store/apps/post'
import { TextField, Select, MenuItem, InputLabel } from '@mui/material'
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
  const posts = useSelector(state => state.posts)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Post?')
    if (confirmation) {
      dispatch(deletePost(id))
      dispatch(fetchPostsData())
    }
  }

  // Handel post edit button
  const handleEdit = id => {
    router.push('/apps/post/edit/' + id)
  }

  //Handel Course published status
  const handleStatus = status => {
    switch (status.formattedValue) {
      case 1:
        return 'Published'
        break
      case 0:
        return 'Draft'
        break
      case 2:
        return 'Pending review'
        break
      default:
        return 'Pending review'
        break
    }
  }

  //Handel post Created At and Updated At
  const handleDate = createdAt => {
    // Create a new Date object using your date string
    const date = new Date(createdAt.formattedValue)

    // Format the date 05/10/2023 10:44
    const formattedDate = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(
      -2
    )}/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`

    return formattedDate
  }

  // Fetch posts data
  useEffect(() => {
    dispatch(fetchPostsData())
  }, [dispatch])

  const renderStatusCell = (params) => {
    const { value } = params;
    const statusText = handleStatus(value);
  
    return (
      <div>
        {statusText && (
          <Chip label={ value == '1' ? 'Published' : value == '0' ? 'Draft' : value == '2' ? 'Pending Review' : 'Pending Review' } color={ value == '1' ? 'primary' : value == '0' ? 'info' : value == '2' ? 'warning' : 'secondary'} sx={{ width: '100%' } } />
        )}
      </div>
    );
  };

  //Columns of post data
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

  //Filter the data for search box
  const filteredCourses = Array.isArray(posts?.data?.data)
    ? posts?.data?.data?.filter(course => {
        const searchTermMatch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.slug.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  return (
    <>
      {filteredCourses ? (
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
                rows={filteredCourses}
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

export default CourseList
