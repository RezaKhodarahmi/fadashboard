import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { Editor } from '@tinymce/tinymce-react'
import AppConfig from 'src/configs/appConfg'
import * as yup from 'yup'
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material'
import { newWebinar } from 'src/store/apps/webinar'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subTitle: yup.string().nullable(),
  date: yup.string().required('The date is required'),
  slug: yup.string().required('Slug is required'),
  description: yup.string().nullable(),
  status: yup.string().required('This field is required'),
  type: yup.string().required('This field is required'),
  regularPrice: yup.number().min(0, 'Regular price must be positive').nullable(),
  vipPrice: yup
    .number()
    .min(0, 'VIP price must be positive')
    .nullable()
    .test('fileType', 'Unsupported File Format', value => {
      // Get the file type from the event
      const fileType = value?.target?.files[0]?.type || null

      // Check if the file type is supported
      return !fileType || SUPPORTED_FORMATS.includes(fileType)
    })
})

export default function EditForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()

  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const handleFileChange = e => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const onSubmit = data => {
    const formData = new FormData()
    if (file) {
      formData.append('image', file, file.name)
    }
    for (const key in data) {
      formData.append(key, data[key])
    }
    dispatch(newWebinar(formData))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('title')} label='Title' fullWidth />
          {errors.title && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-title-helper'>
              {errors.title.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('subTitle')} label='Sub Title' fullWidth />
          {errors.subTitle && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-subTitle-helper'>
              {errors.subTitle.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('slug')} label='Slug' fullWidth />
          {errors.slug && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-slug-helper'>
              {errors.slug.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('date')} label='Date' type='date' fullWidth />
          {errors.date && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-date-helper'>
              {errors.date.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('instructor')} label='Instructor' fullWidth />
          {errors.instructor && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-instructor-helper'>
              {errors.instructor.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={12}>
          <InputLabel id='description'>Description</InputLabel>
          <Controller
            name='description'
            labelId='description'
            control={control}
            rules={validationSchema.description}
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

        <Grid marginTop={5} item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='enroll-select-label'>Status</InputLabel>
            <Select {...register('status')} labelId='Status-select-label' label='Status'>
              <MenuItem value={'1'}>Active</MenuItem>
              <MenuItem value={'0'}>Inactive</MenuItem>
              <MenuItem value={'2'}>Pending review</MenuItem>
            </Select>
          </FormControl>

          {errors.status && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-status-helper'>
              {errors.status.message}
            </FormHelperText>
          )}
        </Grid>

        <Grid marginTop={5} item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='enroll-select-label'>Type (Free or Paid)</InputLabel>
            <Select {...register('type')} labelId='type-select-label' label='Type'>
              <MenuItem value={'1'}>Free</MenuItem>
              <MenuItem value={'2'}>Paid</MenuItem>
            </Select>
          </FormControl>
          {errors.type && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-type-helper'>
              {errors.type.message}
            </FormHelperText>
          )}
        </Grid>

        <>
          <Grid marginTop={5} item xs={12} sm={6}>
            <TextField {...register('regularPrice')} label='Regular Price' fullWidth />
            {errors.regularPrice && (
              <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-regularPrice-helper'>
                {errors.regularPrice.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid marginTop={5} item xs={12} sm={6}>
            <TextField {...register('vipPrice')} label='VIP Price' fullWidth />
            {errors.vipPrice && (
              <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-vipPrice-helper'>
                {errors.vipPrice.message}
              </FormHelperText>
            )}
          </Grid>
        </>
        <Grid marginTop={5} item xs={12} sm={6}>
          <Controller
            name='image'
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <>
                {imageUrl && <img alt='Image' src={imageUrl} width='100' />}
                <input
                  type='file'
                  {...field}
                  onChange={e => {
                    field.onChange(e)
                    handleFileChange(e)
                  }}
                />
                {errors.image && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-image-helper'>
                    {errors.image.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </Grid>
      </Grid>

      <Grid marginTop={10} item xs={12} sm={6}>
        <Button type='submit' size='large' variant='contained' color='success'>
          Create
        </Button>
      </Grid>
    </form>
  )
}
