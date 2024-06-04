import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchTestData, deleteTest } from 'src/store/apps/test'
import { fetchCycleData } from 'src/store/apps/cycle'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
    dispatch(fetchTestData())
    dispatch(fetchCycleData())
  }, [dispatch])

  const renderEnrollCell = (params) => {
    const { value } = params;
    const statusText = handleEnroll(value);
  
    return (
      <div>
        {statusText && (
          <Chip label={ value == '1' ? 'Need Enroll' : value == '0' ? 'Free' : value == '2' ? 'Pending Review' : 'Pending Review' } color={ value == '1' ? 'primary' : value == '0' ? 'info' : value == '2' ? 'warning' : 'secondary'} sx={{ width: '100%' }} />
        )}
      </div>
    );
  };

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
    { field: 'cycle', headerName: 'cycle', width: 120, renderCell: handelCycle },
    { field: 'createdAt', headerName: 'Created At', flex: 0.1, minWidth: 50 , renderCell: handleDate},
    { field: 'needEnroll', headerName: 'Enroll Status', flex: 0.1, minWidth: 50, renderCell: renderEnrollCell },
    { field: 'status', headerName: 'Status', flex: 0.06, minWidth: 50, renderCell: renderStatusCell },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.1,
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
      flex: 0.1,
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

  const filteredTests = Array.isArray(tests?.data?.data)
    ? tests?.data?.data?.filter(test => {
        const searchTermMatch =
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.slug.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  return (
    <>
      <Card>
        <CardHeader 
          title='All Tests' 
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
        </Box>
      </Card>
    </>
  )
}

export default TestList
