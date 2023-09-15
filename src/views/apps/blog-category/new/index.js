import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { Editor } from '@tinymce/tinymce-react'
import * as yup from 'yup'
import AppConfig from 'src/configs/appConfg'
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material'
import { newCategory, fetchCategoriesData } from 'src/store/apps/blog-category'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required'),
  status: yup.string().required('Status is required')
})

export default function NewCategoryForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()

  //Set state
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const categories = useSelector(state => state.blogCategoryList)
  useEffect(() => {
    dispatch(fetchCategoriesData())
  }, [dispatch])

  const handleFileChange = e => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const onSubmit = data => {
    const formData = new FormData()
    for (const key in data) {
      formData.append(key, data[key])
    }
    if (file) {
      formData.append('image', file)
    }
    dispatch(newCategory(formData))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('title')} name='title' label='Category title' fullWidth />
          {errors.title && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-title-helper'>
              {errors.title.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('slug')} name='slug' label='Category slug' fullWidth />
          {errors.slug && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-slug-helper'>
              {errors.slug.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={12}>
          <InputLabel id='description'>Description</InputLabel>
          <Controller
            name='description'
            labelId='description'
            control={control}
            rules={validationSchema.content}
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
          <TextField {...register('keywords')} name='keywords' label='Category keywords' fullWidth />
          {errors.keywords && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-keywords-helper'>
              {errors.keywords.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('metaTitle')} name='metaTitle' label='Category metaTitle' fullWidth />
          {errors.metaTitle && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaTitle-helper'>
              {errors.metaTitle.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField
            {...register('metaDescription')}
            name='metaDescription'
            label='Category metaDescription'
            fullWidth
          />
          {errors.metaDescription && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaDescription-helper'>
              {errors.metaDescription.message}
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
          <FormControl fullWidth>
            <InputLabel id='parentId-select-label'>Parent </InputLabel>
            <Select
              {...register('parentId')}
              name='parentId'
              labelId='parentId-select-label'
              defaultValue={'0'}
              label='Parent Id'
            >
              <MenuItem value={'0'}>without parents</MenuItem>
              {categories.data?.data?.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {errors.parentId && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-parentId-helper'>
              {errors.parentId.message}
            </FormHelperText>
          )}
        </Grid>

        <Grid marginTop={5} item xs={12} sm={6} flex>
          <img alt='Image' src={imageUrl} width='100' />
          <input type='file' name='image' onChange={handleFileChange} />
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
