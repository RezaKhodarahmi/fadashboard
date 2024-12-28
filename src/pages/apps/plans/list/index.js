import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchPlansData, deletePlan } from 'src/store/apps/plans'
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

const PlansList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const Plans = useSelector(state => state.plans)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(fetchPlansData())
  }, [dispatch])

  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Plan?')
    if (confirmation) {
      dispatch(deletePlan(id))
      dispatch(fetchPlansData())
    }
  }

  const handleEdit = id => {
    router.push('/apps/plans/edit/' + id)
  }

  const handleDate = createdAt => {
    const date = new Date(createdAt.formattedValue)

    const formattedDate = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(
      -2
    )}/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`

    return formattedDate
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.01, minWidth: 50 },
    { field: 'title', headerName: 'Title', flex: 0.3, minWidth: 50 },
    { field: 'offerID', headerName: 'CODE', flex: 0.3, minWidth: 50 },
    { field: 'createdAt', headerName: 'Created At', flex: 0.15, minWidth: 50, renderCell: handleDate },
    { field: 'updatedAt', headerName: 'Modified At', flex: 0.15, minWidth: 50, renderCell: handleDate },
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
      {Plans?.data ? (
        <Card>
          <CardHeader
            title='All Plans'
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
              rows={Plans?.data?.data || []} // Fallback to an empty array
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              checkboxSelection
              paginationMode='server'
              page={page}
              onPageChange={newPage => setPage(newPage)}
              pagination
            />
          </Box>
        </Card>
      ) : null}
    </>
  )
}

export default PlansList
