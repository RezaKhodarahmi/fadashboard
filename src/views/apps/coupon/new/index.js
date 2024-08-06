import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { Card, CardHeader, CardContent, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box, Badge } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { newCoupon } from 'src/store/apps/coupon'
import * as yup from 'yup'
import { useRouter } from 'next/router'

// Import the coupon validation schema
const couponValidationSchema = yup.object().shape({
  code: yup.string().required('Coupon code is required'),

  course_id: yup.array().of(yup.number()).nullable(),
  expires_at: yup.date().nullable(),
  is_used: yup.boolean().default(false),
  minimum_spend: yup.number().positive().nullable(),
  maximum_spend: yup.number().positive().nullable(),
  individual_use_only: yup.boolean().default(false),
  exclude_products: yup.array().of(yup.number()).nullable(),
  allowed_emails: yup.array().of(yup.string().email()).nullable(),
  exclude_sale_items: yup.boolean().default(false),
  usage_limit_per_coupon: yup.number().integer().min(1).nullable(),
  usage_limit_per_user: yup.number().integer().min(1).nullable()
})

export default function CrateUserForm() {
  const [generatedCode, setGeneratedCode] = useState('')
  const [allowedEmails, setAllowedEmails] = useState([])

  //Hooks
  const coupon = useSelector(state => state.coupon)
  const dispatch = useDispatch()

  // Form submission handler
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(couponValidationSchema),
    defaultValues: {
      code: '',
      course_id: [],
      expires_at: null,
      is_used: false,
      minimum_spend: null,
      maximum_spend: null,
      individual_use_only: false,
      exclude_products: [],
      allowed_emails: [],
      exclude_sale_items: false,
      usage_limit_per_coupon: 10,
      usage_limit_per_user: 10
    }
  })

  //Check if coupon created successfully
  useEffect(() => {
    if (coupon?.data?.data?.id) {
      reset()
      setGeneratedCode(null)
    }
  }, [coupon])

  // Function to generate a random coupon code
  const generateCouponCode = () => {
    // Implement your logic to generate a random coupon code
    const randomCode = 'OFFER' + Math.random().toString(36).substring(2, 6).toUpperCase()
    setGeneratedCode(randomCode)
    register('code').value = randomCode
  }

  const onSubmit = data => {
    const combinedData = {
      ...data,
      allowed_emails: allowedEmails
    }
    dispatch(newCoupon(combinedData))
  }

  const handleAddEmail = () => {
    setAllowedEmails([...allowedEmails, ''])
  }

  const handleRemoveEmail = index => {
    setAllowedEmails(allowedEmails.filter((_, i) => i !== index))
  }

  const handleEmailChange = (index, value) => {
    const updatedEmails = allowedEmails.map((email, i) => (i === index ? value : email))
    setAllowedEmails(updatedEmails)
  }

  return (
    <>
      <Card>
        <CardHeader title='Add New Coupon' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} mb={3}>
                <Box display='flex' alignItems='center'>
                  <TextField {...register('code')} value={generatedCode} label='Coupon Code' fullWidth />
                  {errors.code && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-code-helper'>
                      {errors.code.message}
                    </FormHelperText>
                  )}
                  <Button variant='contained' onClick={generateCouponCode} sx={{ ml: 2 }}>
                    Generate Code
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('discount_percentage')} value={null} label='Discount Percentage' fullWidth />
                {errors.discount_percentage && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-discount_percentage-helper'>
                    {errors.discount_percentage.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('discount_amount')} label='Discount Amount' fullWidth />
                {errors.discount_amount && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-discount_amount-helper'>
                    {errors.discount_amount.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('course_id')} label='Course ID' fullWidth />
                {errors.course_id && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-course_id-helper'>
                    {errors.course_id.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('expires_at')} label='Expiration Date' type='date' fullWidth />
                {errors.expires_at && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-expires_at-helper'>
                    {errors.expires_at.message}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('minimum_spend')} label='Minimum Spend' fullWidth />
                {errors.minimum_spend && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-minimum_spend-helper'>
                    {errors.minimum_spend.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('maximum_spend')} label='Maximum Spend' fullWidth />
                {errors.maximum_spend && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-maximum_spend-helper'>
                    {errors.maximum_spend.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                <FormControl fullWidth>
                  <InputLabel id='is_used-select-label'>Individual use only</InputLabel>
                  <Select
                    {...register('individual_use_only')}
                    defaultValue={false}
                    labelId='individual_use_only-select-label'
                    label='Individual use only'
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
                {errors.individual_use_only && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-individual_use_only-helper'>
                    {errors.individual_use_only.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                {allowedEmails.map((email, index) => (
                  <Box key={index} display='flex' alignItems='center' mb={1}>
                    <TextField
                      value={email}
                      onChange={e => handleEmailChange(index, e.target.value)}
                      label={`Email ${index + 1}`}
                      fullWidth
                    />
                    <Button onClick={() => handleRemoveEmail(index)}>Remove</Button>
                  </Box>
                ))}
                <Button onClick={handleAddEmail}>Add an allowed email</Button>
              </Grid>

              <Grid item xs={12} sm={6} mb={3}>
                <FormControl fullWidth>
                  <InputLabel id='is_used-select-label'>Exclude sale items</InputLabel>
                  <Select
                    {...register('exclude_sale_items')}
                    defaultValue={false}
                    labelId='exclude_sale_items-select-label'
                    label='Exclude sale items'
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
                {errors.exclude_sale_items && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-exclude_sale_items-helper'>
                    {errors.exclude_sale_items.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('usage_limit_per_coupon')} type='number' label='Usage limit per coupon' fullWidth />
                {errors.usage_limit_per_coupon && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-usage_limit_per_coupon-helper'>
                    {errors.usage_limit_per_coupon.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6} mb={3}>
                <TextField {...register('usage_limit_per_user')} type='number' label='usage limit per user' fullWidth />
                {errors.usage_limit_per_user && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-usage_limit_per_user-helper'>
                    {errors.usage_limit_per_user.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' size='large' variant='contained' color='success'>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
