import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { useAuth } from 'src/hooks/useAuth'
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Avatar } from '@mui/material'
import { updateUser } from 'src/store/apps/user'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape({
  // firstName: yup.string().required('First Name is required'),
  // lastName: yup.string().required('Last Name is required'),
  // email: yup.string().email('Invalid email').required('Email is required'),
  // phone: yup.string('Phone is not correct'),
  // address: yup.string('Address is not correct'),
  // postalCode: yup.string('Postal Code is not correct'),
  // country: yup.string('Country is not correct')
})

export default function EditForm(props) {
  //Hooks
  const auth = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()

  //Set state
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])

  //Get data from props and update state
  useEffect(() => {
    if (props.transactionData) {
      reset(props.transactionData)
      setUser(props.transactionData.user)
      setCourses(props.transactionData.courses)
      setLoading(false)
    }
  }, [props, reset])

  //Update data
  const onSubmit = data => {
    dispatch(updateUser(data))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loading ? (
        <>
          <input type='hidden' {...register('transaction_ID')} />

          <Grid container spacing={2}>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField value={user?.email} name='userEmail' label='User Email' aria-readonly fullWidth />
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField
                value={user?.firstName + ' ' + user?.lastName}
                name='userName'
                label='User Name'
                aria-readonly
                fullWidth
              />
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <Select name='userName' label='User Name' aria-readonly fullWidth>
                {courses?.map(course => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid marginTop={10} item xs={12} sm={6}>
            <Button type='submit' size='large' variant='contained' color='success'>
              Update
            </Button>
          </Grid>
        </>
      ) : (
        'Loading'
      )}
    </form>
  )
}
