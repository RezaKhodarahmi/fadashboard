import React, { useState, useEffect } from 'react'
import {
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { MultiSelect } from 'react-multi-select-component'

import { fetchData } from 'src/store/apps/course'
import { updateTransaction } from 'src/store/apps/transaction'
import { useDispatch, useSelector } from 'react-redux'

export default function OrderView(props) {
  const [transactionData, setTransactionData] = useState({})
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [getCourses, setGetCourses] = useState(false)
  const [courses, setCourses] = useState([])
  const [openCourseModel, setOpenCourseModel] = useState(false)

  const dispatch = useDispatch()
  const coursesData = useSelector(state => state.course)

  useEffect(() => {
    if (props.transactionData) {
      setTransactionData(props.transactionData)
      setSelectedStatus(props.transactionData.Transaction_Status)

      // Map the courses from props.transactionData to the desired format
      const mappedCourses =
        Array.isArray(props.transactionData.courses) &&
        props.transactionData.courses.map(course => ({
          label: course.title,
          value: course.id
        }))

      setCourses(mappedCourses)
      setLoading(false)
    }
  }, [props?.transactionData])

  useEffect(() => {
    if (coursesData) {
      setGetCourses(false)
    }
  }, [coursesData])

  useEffect(() => {
    if (getCourses) {
      dispatch(fetchData())
    }
  }, [getCourses])

  const handleAddCourse = () => {
    setGetCourses(true)
    setOpenCourseModel(true)
  }

  const handleCloseCourseModel = () => {
    setOpenCourseModel(false)
  }

  const handleSelectCourse = selectedCourse => {
    setCourses(selectedCourse)
    handleCloseCourseModel()
  }

  const handleDeleteCourse = courseId => {
    const oldCourses = [...courses]
    const newCourses = oldCourses.filter(course => course.value != courseId)

    setCourses(newCourses)
  }

  const handleStatusChange = event => {
    setSelectedStatus(event.target.value)
  }

  const options =
    Array.isArray(coursesData.data.data) &&
    coursesData.data.data.map(course => ({
      label: course.title,
      value: course.id
    }))

  const handleUpdateTransaction = () => {
    dispatch(updateTransaction({ items: courses, status: selectedStatus, id: transactionData.Transaction_ID }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Typography variant='h5'>Transaction Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='body1'>
            User: {transactionData.user?.firstName} {transactionData.user?.lastName}
          </Typography>
          <Typography variant='body1'>Email: {transactionData.user?.email}</Typography>
          <Typography variant='body1'>Phone: {transactionData.user?.phone}</Typography>
          <Typography variant='body1'>Transaction Date: {transactionData.Transaction_Date}</Typography>
          <Typography variant='body1'>Transaction Type: {transactionData.Transaction_Type}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={selectedStatus} label='Status' onChange={handleStatusChange}>
              <MenuItem value='succeeded'>Succeeded</MenuItem>
              <MenuItem value='cancelled'>Cancelled</MenuItem>
              <MenuItem value='requires_payment_method'>Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider style={{ margin: '20px 0' }} />

      <Typography variant='h6'>Order Items</Typography>
      <List>
        {Array.isArray(courses) &&
          courses.map((course, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <Button onClick={() => handleDeleteCourse(course.value)}>Delete</Button>
                </>
              }
            >
              <ListItemText primary={course.label} secondary={`ID: ${course.value}`} />
            </ListItem>
          ))}
      </List>
      <Button variant='contained' onClick={handleAddCourse}>
        Add New Course
      </Button>
      <Dialog
        open={openCourseModel}
        onClose={() => setOpenCourseModel(false)}
        fullWidth={true}
        maxWidth='md'
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Select Courses to Add</DialogTitle>
        <DialogContent style={{ height: '500px', overflowY: 'auto' }}>
          <MultiSelect
            options={options}
            value={courses}
            onChange={handleSelectCourse}
            labelledBy='Select Courses'
            hasSelectAll={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseModel(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleAddCourse} color='primary'>
            Add Selected Courses
          </Button>
        </DialogActions>
      </Dialog>

      <Divider style={{ margin: '20px 0' }} />

      <Typography variant='h6'>Total: {transactionData.Amount}</Typography>
      {Array.isArray(transactionData.coupons.length) && transactionData.coupons.length > 0 && (
        <Typography variant='body1'>Coupon Used: Yes</Typography>
      )}

      <Divider style={{ margin: '20px 0' }} />

      <Button variant='contained' color='primary' onClick={handleUpdateTransaction}>
        Update Transaction
      </Button>
    </div>
  )
}
