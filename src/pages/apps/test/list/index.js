import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchTestData, deleteTest } from 'src/store/apps/test'
import { fetchCycleData } from 'src/store/apps/cycle'

import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const TestList = () => {
  const router = useRouter()
  const cycles = useSelector(state => state.cycleListReducer)
  const dispatch = useDispatch()
  const tests = useSelector(state => state.test)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Test?')
    if (confirmation) {
      dispatch(deleteTest(id))
      dispatch(fetchTestData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/test/edit/' + id)
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

  const handelCycle = cycle => {
    switch (cycle.row.cycleId) {
      case cycle.row.cycleId:
        return cycles?.data?.data
          .filter(item => item.id == cycle.row.cycleId)
          .map(item => <span key={item.id}>{item.name}</span>)

      default:
        return null
    }
  }

  useEffect(() => {
    dispatch(fetchTestData())
    dispatch(fetchCycleData())
  }, [dispatch])

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 100 },
    { field: 'cycle', headerName: 'cycle', width: 100, renderCell: handelCycle },
    { field: 'needEnroll', headerName: 'needEnroll', width: 70, renderCell: handelEnroll },
    { field: 'status', headerName: 'status', width: 70, renderCell: handelStatus },
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

  const filteredTests = Array.isArray(tests?.data?.data)
    ? tests?.data?.data?.filter(test => {
        const searchTermMatch =
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.slug.toLowerCase().includes(searchTerm.toLowerCase())

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

      {filteredTests ? (
        <DataGrid
          rows={filteredTests}
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

export default TestList
