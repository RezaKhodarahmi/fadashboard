import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { useAuth } from 'src/hooks/useAuth'
import { TextField, Button, Grid, Select, MenuItem, FormControl, Box, InputLabel, Avatar } from '@mui/material'
import { updateUser } from 'src/store/apps/user'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { Editor } from '@tinymce/tinymce-react'
import AppConfig from 'src/configs/appConfg'
import { useRouter } from 'next/router'

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string('Phone is not correct'),
  address: yup.string('Address is not correct'),
  postalCode: yup.string('Postal Code is not correct'),
  country: yup.string('Country is not correct'),
  descriptions: yup.string().nullable().notRequired()
})

export default function EditForm(props) {
  const auth = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()
  const Router = useRouter()

  //Set state
  const [status, setStatus] = useState(null)
  const [role, setRole] = useState(null)
  const [emailVerification, setEmailVerification] = useState(null)
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const handleFileChange = e => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  useEffect(() => {
    if (props.userData) {
      reset(props.userData)
      setStatus(props.userData.status)
      setRole(props.userData.role)
      setImageUrl(props.userData.avatar)
      setEmailVerification(props.userData.emailVerification)
    }
  }, [props, reset])

  const onSubmit = data => {
    const formData = new FormData()
    for (const key in data) {
      formData.append(key, data[key])
    }
    formData.append('image', file)
    dispatch(updateUser(formData))
    Router.replace('/apps/user/list')
  }

  return (
    <>
      {props.userData ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type='hidden' {...register('id')} />

          <Grid container spacing={2}>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('firstName')} label='First Name' fullWidth />
              {errors.firstName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-firstName-helper'>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('lastName')} label='Last Name' fullWidth />
              {errors.lastName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-lastName-helper'>
                  {errors.lastName.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12}>
              <TextField {...register('email')} label='Email' fullWidth />
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
              {role ? (
                <FormControl fullWidth>
                  <InputLabel id='role-select-label'>Role</InputLabel>
                  <Select {...register('role')} defaultValue={role} labelId='role-select-label' label='Role'>
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
              ) : null}
              {errors.role && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-role-helper'>
                  {errors.role.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('phone')} label='Phone' fullWidth />
              {errors.phone && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-phone-helper'>
                  {errors.phone.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('vip', { type: 'date' })} label='VIP' type={'date'} fullWidth />
              {errors.vip && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-vip-helper'>
                  {errors.vip.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('vipPlan')} defaultValue={0} label='VIP PLAN' fullWidth />
              {errors.vipPlan && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-vipPlan-helper'>
                  {errors.vipPlan.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              {emailVerification ? (
                <FormControl fullWidth>
                  <InputLabel id='status-select-label'>Email Verification</InputLabel>
                  <Select
                    {...register('emailVerification')}
                    labelId='emailVerification-select-label'
                    label='Email Verification'
                    defaultValue={emailVerification}
                  >
                    <MenuItem value={'1'}>Yes</MenuItem>
                    <MenuItem value={'0'}>No</MenuItem>
                  </Select>
                </FormControl>
              ) : null}
              {errors.emailVerification && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-emailVerification-helper'>
                  {errors.emailVerification.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12}>
              <TextField {...register('address')} label='Address' fullWidth />
              {errors.address && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-address-helper'>
                  {errors.address.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12}>
              <TextField {...register('city')} label='City' fullWidth />
              {errors.city && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-city-helper'>
                  {errors.city.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('postalCode')} label='Postal Code' fullWidth />
              {errors.postalCode && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-postalCode-helper'>
                  {errors.postalCode.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('country')} label='Country' fullWidth />
              {errors.country && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-country-helper'>
                  {errors.country.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              <TextField {...register('dateOfBirth', { type: 'date' })} label='Date of Birth' type={'date'} fullWidth />
              {errors.dateOfBirth && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-dateOfBirth-helper'>
                  {errors.dateOfBirth.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12}>
              <TextField {...register('referralCode')} label='Referral Code' fullWidth />
              {errors.referralCode && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-referralCode-helper'>
                  {errors.referralCode.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12}>
              <TextField {...register('credit')} label='Credit' fullWidth />
              {errors.credit && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-credit-helper'>
                  {errors.credit.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12}>
              <TextField {...register('password')} label='Password' fullWidth />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-password-helper'>
                  {errors.password.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6}>
              {status ? (
                <FormControl fullWidth>
                  <InputLabel id='status-select-label'>Status</InputLabel>
                  <Select {...register('status')} labelId='status-select-label' label='Status' defaultValue={status}>
                    <MenuItem value={'1'}>Active</MenuItem>
                    <MenuItem value={'0'}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              ) : null}
              {errors.status && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-status-helper'>
                  {errors.status.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid marginTop={5} item xs={12} sm={6} flex>
              <Avatar alt='Avatar' src={imageUrl} sx={{ width: 50, height: 50 }} />
              <input type='file' onChange={handleFileChange} />
            </Grid>

            <Grid marginTop={5} item xs={12} sm={12}>
              <InputLabel id='descriptions'>Description</InputLabel>
              <Controller
                name='descriptions'
                labelId='descriptions'
                control={control}
                rules={validationSchema.descriptions}
                render={({ field, fieldState }) => (
                  <Box sx={{ mt: 2 }}>
                    <Editor
                      apiKey={AppConfig.TINYMCE_KEY}
                      value={field.value}
                      onEditorChange={value => field.onChange(value)}
                      onBlur={field.onBlur}
                      init={AppConfig.TINYMCE_INIT}
                    />
                    {fieldState.error && <Box sx={{ color: 'red', mt: 1 }}>{fieldState.error.message}</Box>}
                  </Box>
                )}
              />
            </Grid>
          </Grid>
          <Grid marginTop={10} item xs={12} sm={6}>
            <Button type='submit' size='large' variant='contained' color='success'>
              Update
            </Button>
          </Grid>
        </form>
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  )
}
