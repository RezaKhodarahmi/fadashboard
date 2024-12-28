// Edit Form Component (edit.js)
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { updatePlan } from 'src/store/apps/plans'

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().nullable(),
  offerID: yup.string().required('Offer ID is required')
})

export default function EditForm({ planData }) {
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

  useEffect(() => {
    if (planData) {
      reset(planData)
    }
  }, [planData, reset])

  const onSubmit = data => {
    dispatch(updatePlan(data))
  }

  return (
    <Card>
      <CardHeader title='Edit Plan' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField {...register('title')} label='Title' fullWidth />
              {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
            </Grid>

            <Grid item xs={12}>
              <TextField {...register('offerID')} label='Offer ID' fullWidth />
              {errors.offerID && <p style={{ color: 'red' }}>{errors.offerID.message}</p>}
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => <TextField {...field} label='Description' fullWidth multiline rows={4} />}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                Update Plan
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
