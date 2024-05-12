import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchWebinarData, deleteWebinar } from 'src/store/apps/webinar'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const CourseList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const webinars = useSelector(state => state.webinar)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Webinar?')
    if (confirmation) {
      dispatch(deleteWebinar(id))
      dispatch(fetchWebinarData())
    }
  }

  // Handel webinar edit button
  const handleEdit = id => {
    router.push('/apps/webinar/edit/' + id)
  }

  //Handle show webinar enrollments
  const handleShowList = id => {
    router.push('/apps/webinar/enrollment/' + id)
  }

  //Handel Course published status
  const handelStatus = status => {
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

  //Handel webinar Created At and Updated At
  const handelDate = createdAt => {
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
    dispatch(fetchWebinarData())
  }, [dispatch])

  //Columns of  data
  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'slug', headerName: 'Slug', width: 100 },
    { field: 'date', headerName: 'Date', width: 100, renderCell: handelDate },
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
    },
    {
      field: 'enrollments',
      headerName: 'Enrollments',
      width: 100,
      renderCell: params => (
        <Button color='success' variant='contained' onClick={() => handleShowList(params.row.id)}>
          List
        </Button>
      )
    },
    { field: 'createdAt', headerName: 'createdAt', width: 100, renderCell: handelDate },
    { field: 'updatedAt', headerName: 'updatedAt', width: 100, renderCell: handelDate }
  ]

  //Filter the data for search box
  const filteredWebinar = Array.isArray(webinars?.data?.data)
    ? webinars?.data?.data?.filter(webinar => {
        const searchTermMatch =
          webinar?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          webinar?.slug?.toLowerCase().includes(searchTerm.toLowerCase())

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

      {filteredWebinar ? (
        <DataGrid
          rows={filteredWebinar}
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

export default CourseList
