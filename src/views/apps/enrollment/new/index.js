import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import FormHelperText from '@mui/material/FormHelperText'
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
  DialogActions,
  TextField,
  Box
} from '@mui/material'
import { MultiSelect } from 'react-multi-select-component'
import * as yup from 'yup'
import { newEnrollment } from 'src/store/apps/enrollment'
import { fetchData } from 'src/store/apps/course'
import { getUserWithEmail } from 'src/store/apps/user'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape()

// Additional imports might be required if not already present
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const Index = () => {
  const initialState = {
    enrollmentDate: null, //date format
    completionDate: null, //date format
    status: '1', //string
    cancelled: '0', //string
    cancellationResult: '' //string
  }

  const [openCourseModel, setOpenCourseModel] = useState(false)
  const [openUsersModel, setOpenUsersModel] = useState(false)
  const [orderCourses, setOrderCourses] = useState([])
  const [courses, setCourses] = useState([])
  const [orderUsers, setOrderUsers] = useState(null)
  const [searchUser, setSearchUser] = useState('')
  const [userError, setUserError] = useState(null)
  const [orderData, setOrderData] = useState(initialState)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      courseId: '',
      email: '',
      enrollmentDate: null,
      completionDate: null,
      status: '',
      cancelled: '',
      cancellationResult: ''
    }
  })

  const dispatch = useDispatch()

  const coursesData = useSelector(state => state.course)
  const usersSearched = useSelector(state => state.user)

  useEffect(() => {
    dispatch(fetchData())
  }, [])

  useEffect(() => {
    // Define a simple email regex for basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (emailRegex.test(searchUser)) {
      dispatch(getUserWithEmail(searchUser))
      setUserError(null)

      // Call your API here with the valid email
    } else {
      setUserError('Invalid email.')
    }
  }, [searchUser])

  useEffect(() => {
    if (usersSearched?.data?.data) {
      setOrderUsers(usersSearched?.data?.data)
    }
  }, [usersSearched])

  const courseOptions =
    Array.isArray(coursesData.data.data) &&
    coursesData.data.data.map(course => ({
      label: course.title,
      value: course.id
    }))

  const handleSelectCourse = selectedCourse => {
    setOrderCourses(selectedCourse)

    setOpenCourseModel(false)
  }

  const handelSearchUser = e => {
    setSearchUser(e.target.value)
    setOrderUsers(null)
  }

  const handleSelectUser = selectedUser => {
    setOrderUsers(searchUser)
    setOpenUsersModel(false)
  }

  useEffect(() => {
    console.log(orderCourses)
  }, [orderCourses])

  const onSubmit = data => {
    console.log(data, orderCourses, orderUsers)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  // user course cycle date status

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Button onClick={() => setOpenCourseModel(true)}>Add course</Button>
          <Button onClick={() => setOpenUsersModel(true)}>Add user</Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel id='status-select-label'>Status</InputLabel>
            <Select {...register('status')} labelId='status-select-label' label='Status' defaultValue='1'>
              <MenuItem value='1'>Active</MenuItem>
              <MenuItem value='0'>Not Active</MenuItem>
            </Select>
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
        </Grid>

        {/* Date Pickers for EnrollmentDate and CompletionDate */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={12} md={6}>
            <Controller
              name='enrollmentDate'
              control={control}
              render={({ field }) => (
                <DatePicker label='Enrollment Date' renderInput={params => <TextField {...params} />} {...field} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name='completionDate'
              control={control}
              render={({ field }) => (
                <DatePicker label='Completion Date' renderInput={params => <TextField {...params} />} {...field} />
              )}
            />
          </Grid>
        </LocalizationProvider>

        {/* Cancelled Select Field */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.cancelled}>
            <InputLabel id='cancelled-select-label'>Cancelled</InputLabel>
            <Select {...register('cancelled')} labelId='cancelled-select-label' label='Cancelled' defaultValue='0'>
              <MenuItem value='1'>Yes</MenuItem>
              <MenuItem value='0'>No</MenuItem>
            </Select>
            <FormHelperText>{errors.cancelled?.message}</FormHelperText>
          </FormControl>
        </Grid>

        {/* CancellationResult TextField */}
        <Grid item xs={12}>
          <TextField
            {...register('cancellationResult')}
            label='Cancellation Result'
            fullWidth
            error={!!errors.cancellationResult}
            helperText={errors.cancellationResult?.message}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button type='submit' variant='contained' color='primary'>
            Create Enrollment
          </Button>
        </Grid>
      </form>
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
            options={courseOptions}
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
        </DialogActions>
      </Dialog>
      <Dialog
        open={openUsersModel}
        onClose={() => setOpenUsersModel(false)}
        fullWidth={true}
        maxWidth='md'
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Select User to Add</DialogTitle>
        <DialogContent style={{ height: '500px', overflowY: 'auto' }}>
          <FormControl fullWidth>
            <InputLabel id='role-select-label'>Search user with email address</InputLabel>
            <TextField onChange={e => handelSearchUser(e)} label='search user' fullWidth />
            {userError && <span style={{ color: 'red' }}>{userError}</span>}
            <Divider style={{ margin: '20px 0' }} />
            {orderUsers ? (
              <span style={{ border: '1px solid lightGray', padding: '5px' }}>
                {orderUsers.email + '-' + orderUsers.firstName + ' ' + orderUsers.lastName}
                <Button onClick={e => handleSelectUser(orderUsers.email)}>Select</Button>
              </span>
            ) : (
              <span>No result</span>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUsersModel(false)} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Index
