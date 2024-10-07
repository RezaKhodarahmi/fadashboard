import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { fetchDemosessionData } from 'src/store/apps/demo-session'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material'
import { saveAs } from 'file-saver'
import { Parser } from 'json2csv'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CourseList = () => {
  const dispatch = useDispatch()
  const { data: demosession } = useSelector(state => state.demosession)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    dispatch(fetchDemosessionData(page + 1, pageSize, searchTerm))
  }, [dispatch, page, pageSize, searchTerm])

  useEffect(() => {
    setCourses(demosession?.courses || [])
  }, [demosession])

  const handleDate = createdAt => {
    const date = new Date(createdAt)
    if (isNaN(date)) return 'Invalid Date'

    const formattedDate = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(
      -2
    )}/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`

    return formattedDate
  }

  const handleCourseSelect = event => {
    setSelectedCourseId(event.target.value)
  }

  const handleExportToCSV = () => {
    const filteredData = filteredRows?.map(item => ({
      ID: item.id,
      'User Name': item.userName,
      Email: item.userEmail,
      Phone: item.userPhone,
      Date: handleDate(item.createdAt),
      'Course Name': item.course?.title || 'N/A' // Export course name
    }))

    const fields = ['ID', 'User Name', 'Email', 'Phone', 'Date', 'Course Name']
    const parser = new Parser({ fields })
    const csv = parser.parse(filteredData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'DemoSessions.csv')
  }

  // Filter the rows based on selected courseId and date range
  const filteredRows =
    demosession?.data?.filter(item => {
      const isWithinCourse = selectedCourseId ? item.courseId === selectedCourseId : true
      const isWithinStartDate = startDate ? new Date(item.createdAt) >= new Date(startDate) : true
      const isWithinEndDate = endDate ? new Date(item.createdAt) <= new Date(endDate) : true

      return isWithinCourse && isWithinStartDate && isWithinEndDate
    }) || []

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.05, minWidth: 50 },
    { field: 'userName', headerName: 'User Name', flex: 0.2, minWidth: 30 },
    { field: 'userEmail', headerName: 'Email', flex: 0.2, minWidth: 70 },
    { field: 'userPhone', headerName: 'Phone', flex: 0.1, minWidth: 70 },
    {
      field: 'createdAT',
      headerName: 'Date',
      flex: 0.06,
      minWidth: 50,
      renderCell: params => handleDate(params.row.createdAt)
    },
    {
      field: 'courseTitle',
      headerName: 'Course Name',
      flex: 0.2,
      minWidth: 150,
      valueGetter: params => params.row.course?.title || 'N/A' // Display course name in DataGrid
    }
  ]

  return (
    <>
      {demosession?.data ? (
        <Card>
          <CardHeader
            title='All Demos Req'
            action={
              <div style={{ display: 'flex', gap: '10px' }}>
                <TextField
                  id='search'
                  variant='outlined'
                  label='Search'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <FormControl variant='outlined' sx={{ minWidth: 200 }}>
                  <InputLabel id='course-select-label'>Select Course</InputLabel>
                  <Select
                    labelId='course-select-label'
                    value={selectedCourseId}
                    onChange={handleCourseSelect}
                    label='Select Course'
                  >
                    <MenuItem value=''>
                      <em>All Courses</em>
                    </MenuItem>
                    {courses.map(course => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  id='start-date'
                  label='Start Date'
                  type='date'
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
                <TextField
                  id='end-date'
                  label='End Date'
                  type='date'
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleExportToCSV}
                  startIcon={<Icon icon='mdi:download' />}
                >
                  Export to CSV
                </Button>
              </div>
            }
          />
          <Box sx={{ height: 650 }}>
            <DataGrid
              rows={filteredRows || []}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              checkboxSelection
              paginationMode='server'
              page={page}
              onPageChange={newPage => setPage(newPage)}
              rowCount={demosession?.total}
              pagination
            />
          </Box>
        </Card>
      ) : null}
    </>
  )
}

export default CourseList
