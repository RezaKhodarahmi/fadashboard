import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { useAuth } from 'src/hooks/useAuth'
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box, Avatar } from '@mui/material'
import { newUser } from 'src/store/apps/user'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string('Phone is not correct'),
  address: yup.string('Address is not correct'),
  postalCode: yup.string('Postal Code is not correct'),
  country: yup.string('Country is not correct')
})

export default function CrateUserForm() {
  const auth = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const dispatch = useDispatch()

  const handleFileChange = e => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0])) // set the temporary URL
  }

  const onSubmit = data => {
    const formData = new FormData()
    for (const key in data) {
      formData.append(key, data[key])
    }
    formData.append('image', file)
    dispatch(newUser(formData))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('firstName')} name='firstName' label='First Name' fullWidth />
          {errors.firstName && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-firstName-helper'>
              {errors.firstName.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('lastName')} name='lastName' label='Last Name' fullWidth />
          {errors.lastName && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-lastName-helper'>
              {errors.lastName.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12}>
          <TextField {...register('email')} name='email' label='Email' fullWidth />
          {errors.email && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-email-helper'>
              {errors.email.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12}>
          <TextField {...register('designation')} label='Designation' fullWidth />
          {errors.designation && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-designation-helper'>
              {errors.designation.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12}>
          <TextField {...register('linkedin')} label='Linkedin' fullWidth />
          {errors.linkedin && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-linkedin-helper'>
              {errors.linkedin.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='role-select-label'>Role</InputLabel>
            <Select {...register('role')} defaultValue={'2000'} name='role' labelId='role-select-label' label='Role'>
              <MenuItem value={'1000'}>Instructor</MenuItem>
              <MenuItem value={'2000'}>Customer</MenuItem>
              <MenuItem value={'3000'}>Author</MenuItem>
              <MenuItem value={'4000'}>Blog manager</MenuItem>
              <MenuItem value={'5000'}>Employee</MenuItem>
              <MenuItem value={'6000'}>Financial manager</MenuItem>
              <MenuItem value={'8000'}>Editor</MenuItem>
              {auth.user?.role === '10000' ? <MenuItem value={'10000'}>Administrator</MenuItem> : null}
            </Select>
          </FormControl>

          {errors.role && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-role-helper'>
              {errors.role.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('phone')} name='phone' label='Phone' fullWidth />
          {errors.phone && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-phone-helper'>
              {errors.phone.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('vip', { type: 'date' })} name='vip' label='VIP' type={'date'} fullWidth />
          {errors.vip && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-vip-helper'>
              {errors.vip.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='status-select-label'>Email Verification</InputLabel>
            <Select
              {...register('emailVerification')}
              name='emailVerification'
              labelId='emailVerification-select-label'
              label='Email Verification'
              defaultValue={'1'}
            >
              <MenuItem value={'1'}>Yes</MenuItem>
              <MenuItem value={'0'}>No</MenuItem>
            </Select>
          </FormControl>

          {errors.emailVerification && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-emailVerification-helper'>
              {errors.emailVerification.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12}>
          <TextField {...register('address')} name='address' label='Address' fullWidth />
          {errors.address && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-address-helper'>
              {errors.address.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('postalCode')} name='postalCode' label='Postal Code' fullWidth />
          {errors.postalCode && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-postalCode-helper'>
              {errors.postalCode.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('country')} name='country' label='Country' fullWidth />
          {errors.country && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-country-helper'>
              {errors.country.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12}>
          <TextField {...register('city')} name='city' label='City' fullWidth />
          {errors.city && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-city-helper'>
              {errors.city.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField
            {...register('dateOfBirth', { type: 'date' })}
            name='dateOfBirth'
            label='Date of Birth'
            type={'date'}
            fullWidth
          />
          {errors.dateOfBirth && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-dateOfBirth-helper'>
              {errors.dateOfBirth.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='status-select-label'>Status</InputLabel>
            <Select
              {...register('status')}
              name='status'
              labelId='status-select-label'
              label='Status'
              defaultValue={'1'}
            >
              <MenuItem value={'1'}>Active</MenuItem>
              <MenuItem value={'0'}>Inactive</MenuItem>
            </Select>
          </FormControl>

          {errors.status && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-status-helper'>
              {errors.status.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('password')} name='password' label='Password' fullWidth />
          {errors.password && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-password-helper'>
              {errors.password.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
      <Grid marginTop={5} item xs={12} sm={6} flex>
        <Avatar alt='Avatar' src={imageUrl} sx={{ width: 50, height: 50 }} />
        <input type='file' name='image' onChange={handleFileChange} />
      </Grid>
      <Grid marginTop={10} item xs={12} sm={6}>
        <Button type='submit' size='large' variant='contained' color='success'>
          Submit
        </Button>
      </Grid>
    </form>
  )
}
