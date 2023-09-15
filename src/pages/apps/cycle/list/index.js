import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchCycleData, deleteCycle } from 'src/store/apps/cycle'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const CycleList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const cycles = useSelector(state => state.cycleListReducer)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Cycle?')
    if (confirmation) {
      dispatch(deleteCycle(id))
      dispatch(fetchData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/cycle/edit/' + id)
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

  const filteredCategiries = Array.isArray(cycles?.data?.data)
    ? cycles?.data?.data?.filter(category => {
        const searchTermMatch =
          category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchTerm.toLowerCase())

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
    </div>
  )
}

export default CycleList
