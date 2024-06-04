import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchCoupons, deleteCoupon } from 'src/store/apps/coupon'
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
  //Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  const coupons = useSelector(state => state.coupon)

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

  //Fetch all coupons
  useEffect(() => {
    dispatch(fetchCoupons())
  }, [dispatch])

  //Set states
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)

  //Handel delete coupon
  const handleDelete = id => {
    const confirmation = window.confirm('Are you sure you want to delete this Coupon?')
    if (confirmation) {
      dispatch(deleteCoupon(id))
      dispatch(fetchCoupons())
    }
  }

  //Handel Edit
  const handleEdit = id => {
    router.push('/apps/coupon/edit/' + id)
  }

  //Define the table columns
  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.01, minWidth: 50 },
    { field: 'code', headerName: 'Coupon', flex: 0.12, minWidth: 50 },
    { field: 'discount_percentage', headerName: 'Percentage', flex: 0.1, minWidth: 50 },
    { field: 'discount_amount', headerName: 'Amount', flex: 0.1, minWidth: 50 },
    { field: 'expires_at', headerName: 'Expires At', flex: 0.1, minWidth: 50 , renderCell: handleDate },
    { field: 'individual_use_only', headerName: 'Individual use only', flex: 0.1, minWidth: 50 },
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

  //Filter the data
  const filteredCoupons = Array.isArray(coupons?.data?.data)
    ? coupons?.data?.data?.filter(coupon => {
        const searchTermMatch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  return (
    <>
      <Card>
        <CardHeader 
          title='All Coupons' 
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
          {filteredCoupons ? (
            <DataGrid
              rows={filteredCoupons}
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
