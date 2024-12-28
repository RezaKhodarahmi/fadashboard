// New Form Component (new.js)
import { useForm, Controller } from 'react-hook-form'
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { newPlan } from 'src/store/apps/plans'

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().nullable(),
  offerID: yup.string().required('Offer ID is required')
})

export default function CreatePlanForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()

  const onSubmit = data => {
    dispatch(newPlan(data))
  }

  return (
    <Card>
      <CardHeader title='Create New Plan' />
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
                Create Plan
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
