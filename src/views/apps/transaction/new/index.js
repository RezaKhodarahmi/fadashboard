import React, { useState, useEffect } from 'react'
import {
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { MultiSelect } from 'react-multi-select-component'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/course'
import { createTransaction } from 'src/store/apps/transaction'
import { getUserWithEmail } from 'src/store/apps/user'

export default function NewTransactionForm() {
  const [searchUserEmail, setSearchUserEmail] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [status, setStatus] = useState('Pending')
  const [transactionType, setTransactionType] = useState('Stripe')
  const [refunded, setRefunded] = useState('0')
  const [selectedCourses, setSelectedCourses] = useState([])
  const [openCourseDialog, setOpenCourseDialog] = useState(false)
  const [courseOptions, setCourseOptions] = useState([])
  const [userError, setUserError] = useState(null)

  const dispatch = useDispatch()
  const coursesData = useSelector(state => state.course)
  const userSearchResult = useSelector(state => state.user?.data?.data)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(coursesData.data?.data)) {
      setCourseOptions(
        coursesData.data.data.map(course => ({
          label: course.title,
          value: course.id,
          cycles: course.cycles || []
        }))
      )
    }
  }, [coursesData])

  const handleSearchUser = () => {
    if (!searchUserEmail) {
      setUserError('Email is required.')
      return
    }
    dispatch(getUserWithEmail(searchUserEmail))
  }

  useEffect(() => {
    if (userSearchResult) {
      setSelectedUser(userSearchResult)
      setUserError(null)
    } else {
      setUserError('User not found.')
    }
  }, [userSearchResult])

  const handleSelectCourse = selected => {
    const updatedCourses = selected.map(s => {
      const existing = selectedCourses.find(course => course.value === s.value)
      return { ...s, selectedCycle: existing?.selectedCycle || '' }
    })
    setSelectedCourses(updatedCourses)
  }

  const handleCycleChange = (courseValue, cycleId) => {
    const updatedCourses = selectedCourses.map(course =>
      course.value === courseValue ? { ...course, selectedCycle: cycleId } : course
    )
    setSelectedCourses(updatedCourses)
  }

  const handleCreateTransaction = () => {
    if (!selectedUser) {
      setUserError('Please select a user.')
      return
    }

    if (!selectedCourses.every(course => course.selectedCycle)) {
      alert('Each course must have an associated cycle selected.')
      return
    }

    const transactionData = {
      userId: selectedUser.id,
      amount,
      currency,
      status,
      transactionType,
      refunded,
      courses: selectedCourses.map(course => ({
        value: course.value,
        selectedCycle: course.selectedCycle
      }))
    }

    dispatch(createTransaction(transactionData))
  }

  return (
    <div>
      <Typography variant='h5'>New Transaction</Typography>

      {/* User Search Section */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              label='Search User by Email'
              value={searchUserEmail}
              onChange={e => setSearchUserEmail(e.target.value)}
              onBlur={handleSearchUser}
              fullWidth
            />
            {userError && <Typography color='error'>{userError}</Typography>}
            {selectedUser && (
              <Typography>
                Selected User: {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Transaction Fields */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              label='Amount'
              value={amount}
              type='number'
              onChange={e => setAmount(e.target.value)}
              fullWidth
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select value={currency} onChange={e => setCurrency(e.target.value)} fullWidth>
              <MenuItem value='USD'>USD</MenuItem>
              <MenuItem value='CAD'>CAD</MenuItem>
              <MenuItem value='EUR'>EUR</MenuItem>
              <MenuItem value='Rial'>Rial</MenuItem>
              <MenuItem value='Other'>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={e => setStatus(e.target.value)} fullWidth>
              <MenuItem value='Pending'>Pending</MenuItem>
              <MenuItem value='Succeeded'>Succeeded</MenuItem>
              <MenuItem value='Cancelled'>Cancelled</MenuItem>
              <MenuItem value='Refund'>Refund</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Transaction Type</InputLabel>
            <Select value={transactionType} onChange={e => setTransactionType(e.target.value)} fullWidth>
              <MenuItem value='Stripe'>Stripe</MenuItem>
              <MenuItem value='Partially'>Partially</MenuItem>
              <MenuItem value='E-Transfer'>E-Transfer</MenuItem>
              <MenuItem value='Iran'>Iran</MenuItem>
              <MenuItem value='Manual'>Manual</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              label='Refunded'
              value={refunded}
              type='number'
              onChange={e => setRefunded(e.target.value)}
              fullWidth
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* Courses Section */}
      <Typography variant='h6' style={{ margin: '20px 0' }}>
        Courses
      </Typography>
      <Button variant='contained' onClick={() => setOpenCourseDialog(true)} style={{ marginBottom: '10px' }}>
        Add Courses
      </Button>
      {selectedCourses.map(course => (
        <div key={course.value}>
          <Typography variant='body1'>{course.label}</Typography>
          <FormControl fullWidth margin='normal'>
            <InputLabel>Select Cycle</InputLabel>
            <Select
              value={course.selectedCycle || ''}
              onChange={e => handleCycleChange(course.value, e.target.value)}
              label='Select Cycle'
            >
              {course?.cycles?.map(cycle => (
                <MenuItem key={cycle.id} value={cycle.id}>
                  {cycle.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ))}

      <Dialog
        open={openCourseDialog}
        onClose={() => setOpenCourseDialog(false)}
        fullWidth
        maxWidth='md' // Larger size
      >
        <DialogTitle>Select Courses</DialogTitle>
        <DialogContent style={{ height: '500px', overflowY: 'auto' }}>
          <MultiSelect
            options={courseOptions}
            value={selectedCourses}
            onChange={handleSelectCourse}
            labelledBy='Select Courses'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseDialog(false)} color='primary' variant='contained'>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Button */}
      <Button variant='contained' color='primary' onClick={handleCreateTransaction} style={{ marginTop: '20px' }}>
        Create Transaction
      </Button>
    </div>
  )
}
