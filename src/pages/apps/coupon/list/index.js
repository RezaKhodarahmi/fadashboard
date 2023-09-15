import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchCoupons, deleteCoupon } from 'src/store/apps/coupon'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const UserList = () => {
  //Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  const coupons = useSelector(state => state.coupon)

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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'code', headerName: 'Coupon', width: 100 },
    { field: 'discount_percentage', headerName: 'Percentage', width: 100 },
    { field: 'discount_amount', headerName: 'Amount', width: 100 },
    { field: 'expires_at', headerName: 'Expires At', width: 150 },
    { field: 'individual_use_only', headerName: 'Individual use only', width: 200 },
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

  //Filter the data
  const filteredCoupons = Array.isArray(coupons?.data?.data)
    ? coupons?.data?.data?.filter(coupon => {
        const searchTermMatch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  return (
    <div style={{ height: 400, width: '100%' }}>
      <TextField
        id='search'
        variant='outlined'
        label='Search by email or phone'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

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
    </div>
  )
}

export default UserList
