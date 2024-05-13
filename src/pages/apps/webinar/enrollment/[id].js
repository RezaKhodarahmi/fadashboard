import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchEnrollments, fetchEnrollmentsCSV } from 'src/store/apps/webinar'
import { Button, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { Parser } from 'json2csv'
import { saveAs } from 'file-saver'

const CourseList = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const users = useSelector(state => state.webinar)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const { id } = router.query

  // Fetch enrollments data
  useEffect(() => {
    if (id) {
      dispatch(fetchEnrollments(id))
    }
  }, [dispatch, id])

  //Columns of  data
  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'firstName', headerName: 'First Name', width: 200 },
    { field: 'lastName', headerName: 'Last Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 200 }
  ]

  //Filter the data for search box
  const filteredWebinarEnrollments = Array.isArray(users?.data?.data)
    ? users?.data?.data?.filter(user => {
        const searchTermMatch =
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.phone?.toLowerCase().includes(searchTerm.toLowerCase())

        return searchTermMatch
      })
    : []

  //Export users
  const exportUsers = () => {
    const processedData = filteredWebinarEnrollments

    if (processedData.length === 0) {
      return
    }

    const fields = ['id', 'firstName', 'lastName', 'email', 'phone']

    const parser = new Parser({ fields })
    const csv = parser.parse(processedData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'webinar.csv')
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <TextField
        id='search'
        variant='outlined'
        label='Search by title or slug'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Button onClick={exportUsers}>Export</Button>
      {filteredWebinarEnrollments ? (
        <DataGrid
          rows={filteredWebinarEnrollments}
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
