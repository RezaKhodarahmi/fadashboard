import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchData, deleteCategory } from 'src/store/apps/category'
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

const CategoryList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const categories = useSelector(state => state.categoryListReducer)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Category?')
    if (confirmation) {
      if (id != 1) {
        dispatch(deleteCategory(id))
        dispatch(fetchData())
      } else {
        window.alert('You cant delete the default category')
      }
    }
  }

  const handleEdit = id => {
    router.push('/apps/category/edit/' + id)
  }

  const handleStatus = status => {
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

  const renderStatusCell = (params) => {
    const { value } = params;
    const statusText = handleStatus(value);
  
    return (
      <div>
        {statusText && (
          <Chip label={ value == '1' ? 'Active' : value == '0' ? 'Inactive' : value == '2' ? 'Pending Review' : 'Pending Review' } color={ value == '1' ? 'success' : value == '0' ? 'secondary' : value == '2' ? 'warning' : 'secondary'} sx={{ width: '100%' }} />
        )}
      </div>
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.01, minWidth: 50 },
    { field: 'title', headerName: 'Title', flex: 0.2, minWidth: 50 },
    { field: 'slug', headerName: 'Slug', flex: 0.2, minWidth: 50 },
    { field: 'keywords', headerName: 'Keywords', flex: 0.2, minWidth: 50 },
    { field: 'status', headerName: 'Status', flex: 0.10, minWidth: 50, renderCell: renderStatusCell },
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

  const filteredCategiries = Array.isArray(categories?.data?.data)
    ? categories?.data?.data?.filter(category => {
      const searchTermMatch =
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())

      return searchTermMatch
    })
    : []

  return (
    <>
      <Card>
        <CardHeader 
          title='All Courses Category' 
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
          {filteredCategiries ? (
            <DataGrid
              rows={filteredCategiries}
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

export default CategoryList
