import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import {
  Button,
  Grid,
  Typography,
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
import { fetchEnrollmentData } from 'src/store/apps/course'
import { getUserWithEmail } from 'src/store/apps/user'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape()

// Additional imports might be required if not already present
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const Index = () => {
  const [openCourseModel, setOpenCourseModel] = useState(false)
  const [openUsersModel, setOpenUsersModel] = useState(false)
  const [orderUsers, setOrderUsers] = useState(null)
  const [searchUser, setSearchUser] = useState('')
  const [userError, setUserError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [orderSelectedUsers, setOrderSelectedUsers] = useState({})

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      enrollmentDate: null,
      completionDate: null,
      status: '1',
      cancelled: '0',
      cancellationResult: ''
    }
  })

  const dispatch = useDispatch()

  const coursesData = useSelector(state => state.course)
  const usersSearched = useSelector(state => state.user)

  useEffect(() => {
    dispatch(fetchEnrollmentData())
  }, [])

  useEffect(() => {
    console.log(coursesData)
  }, [coursesData])

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (emailRegex.test(searchUser)) {
      dispatch(getUserWithEmail(searchUser))
      setUserError(null)
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
    Array.isArray(coursesData?.data?.data) &&
    coursesData?.data?.data?.map(course => ({
      label: course.title + '(' + course?.teachers[0]?.firstName + ' ' + course?.teachers[0]?.lastName + ')',
      value: course.id
    }))

  const handleSelectCourse = selected => {
    const updatedSelectedCourses = selected?.map(s => {
      const existing = selectedCourses?.find(sc => sc.value === s.value)

      return { ...s, selectedCycle: existing?.selectedCycle || '' }
    })
    setSelectedCourses(updatedSelectedCourses)
  }

  const onCycleChange = (courseValue, cycleId) => {
    const updatedSelectedCourses = selectedCourses.map(course =>
      course.value === courseValue ? { ...course, selectedCycle: cycleId } : course
    )
    setSelectedCourses(updatedSelectedCourses)
  }

  const handelSearchUser = e => {
    setSearchUser(e.target?.value)
  }

  const handleSelectUser = userId => {
    const selectedUser = orderUsers?.email
    if (selectedUser) {
      setOrderSelectedUsers(selectedUser) // Update to hold the selected user object directly
      setOpenUsersModel(false) // Close the modal after selection
    } else {
      console.error('Selected user not found')
    }
  }

  const onSubmit = data => {
    dispatch(newEnrollment({ data, selectedCourses, orderSelectedUsers }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Button onClick={() => setOpenCourseModel(true)}>Add course</Button>

          <Button onClick={() => setOpenUsersModel(true)}>Add user</Button>
        </Grid>
        <Grid spacing={2}>
          {selectedCourses?.map(course => (
            <React.Fragment key={course.value}>
              <Typography variant='subtitle1'>
                {coursesData?.data?.data.find(item => item.id === course.value)?.title || 'Course not found'}
              </Typography>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Cycle</InputLabel>
                <Select
                  value={course.selectedCycle || ''}
                  onChange={e => onCycleChange(course.value, e.target.value)}
                  label='Cycle'
                >
                  {coursesData?.data?.data
                    .find(item => item.id === course.value)
                    ?.cycles.map(cycle => (
                      <MenuItem key={cycle.id} value={cycle.id}>
                        {cycle.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </React.Fragment>
          ))}
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
          <Grid style={{ margin: '10px 0' }} item xs={12} md={6}>
            <Controller
              name='enrollmentDate'
              control={control}
              render={({ field }) => (
                <DatePicker label='Enrollment Date' renderInput={params => <TextField {...params} />} {...field} />
              )}
            />
          </Grid>
          <Grid style={{ margin: '10px 0' }} item xs={12} md={6}>
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
        <Grid style={{ margin: '10px 0' }} item xs={12} md={6}>
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
        <Grid style={{ margin: '10px 0' }} item xs={12}>
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
            value={selectedCourses}
            onChange={handleSelectCourse}
            labelledBy='Select Courses'
            hasSelectAll={true}
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
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Index
