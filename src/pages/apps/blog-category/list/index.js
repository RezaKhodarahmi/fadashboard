import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchCategoriesData, deleteCategory } from 'src/store/apps/blog-category'
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
  const categories = useSelector(state => state.blogCategoryList)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Category?')
    if (confirmation) {
      if (id != 1) {
        dispatch(deleteCategory(id))
        dispatch(fetchCategoriesData())
      } else {
        window.alert('You cant delete the default category')
      }
    }
  }

  const handleEdit = id => {
    router.push('/apps/blog-category/edit/' + id)
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

  useEffect(() => {
    dispatch(fetchCategoriesData())
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
    { field: 'createdAt', headerName: 'Created At', flex: 0.20, minWidth: 50, renderCell: handleDate },
    { field: 'updatedAt', headerName: 'Modified At', flex: 0.20, minWidth: 50, renderCell: handleDate },
    { field: 'status', headerName: 'Status', flex: 0.10, minWidth: 50, renderCell: renderStatusCell },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.15,
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
      flex: 0.20,
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

  const filteredCategories = Array.isArray(categories?.data?.data)
    ? categories?.data?.data?.filter(category => {
      const searchTermMatch =
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())

      return searchTermMatch
    })
    : []

  return (
    <>
      {filteredCategories ? (
        <Card>
          <CardHeader
            title='All Post Categories'
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
              rows={filteredCategories}
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

export default CategoryList
