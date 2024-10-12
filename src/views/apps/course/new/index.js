import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import FormHelperText from '@mui/material/FormHelperText'
import { Editor } from '@tinymce/tinymce-react'
import * as yup from 'yup'
import AppConfig from 'src/configs/appConfg'
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material'
import { newCourse } from 'src/store/apps/course'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { formatSlug } from 'src/utils/slugUtils'

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subTitle: yup.string().nullable().notRequired(),
  slug: yup.string().required('Slug is required'),
  description: yup.string().nullable().notRequired(),
  englishDescription: yup.string().nullable().notRequired(),
  abstract: yup.string().nullable().notRequired(),
  keywords: yup.string().nullable().notRequired(),
  metaTitle: yup.string().nullable().notRequired(),
  metaDescription: yup.string().nullable().notRequired(),
  status: yup.string().oneOf(['1', '0'], 'Invalid status').required('Status is required'),
  type: yup.string().oneOf(['1', '0'], 'Invalid type').required('Type is required'),
  introURL: yup.string().url('Must be a valid URL').nullable().notRequired(),
  image: yup
    .mixed()
    .required('Course poster is required')
    .test('fileFormat', 'Unsupported Format', value => value && value[0] && SUPPORTED_FORMATS.includes(value[0].type)),
  introPoster: yup
    .mixed()
    .nullable()
    .notRequired()
    .test('fileFormat', 'Unsupported Format', value => value && value[0] && SUPPORTED_FORMATS.includes(value[0].type)),
  certificate: yup
    .mixed()
    .nullable()
    .notRequired()
    .test('fileFormat', 'Unsupported Format', value => value && value[0] && SUPPORTED_FORMATS.includes(value[0].type))
})

export default function NewCourseForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const router = useRouter()

  const dispatch = useDispatch()

  //Set state
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [certificateFile, setCertificateFile] = useState(null)
  const [certificateURL, setCertificateURL] = useState(null)
  const [editStatus, setEditStatus] = useState(false)
  const [videoImageFile, setVideoImageFile] = useState(null)
  const [videoImageUrl, setVideoImageUrl] = useState(null)

  const handleFileChange = e => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const handleVideoPhotoChange = e => {
    setVideoImageFile(e.target.files[0])
    setVideoImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const handleCertificateChange = e => {
    setCertificateFile(e.target.files[0])
    setCertificateURL(URL.createObjectURL(e.target.files[0]))
  }

  const course = useSelector(state => state.course)

  useEffect(() => {
    if (editStatus && course.data?.data?.id) {
      router.push(`/apps/course/edit/${course.data?.data.id}`)
      setEditStatus(false)
    }
  }, [editStatus, course])

  const onSubmit = data => {
    const formData = new FormData()
    data.slug = formatSlug(data.slug)

    if (file) {
      formData.append('image', file)
    }
    if (videoImageFile) {
      formData.append('introPoster', videoImageFile)
    }
    if (certificateFile) {
      formData.append('certificate', certificateFile)
    }
    for (const key in data) {
      formData.append(key, data[key])
    }
    dispatch(newCourse(formData))
    setEditStatus(true)
  }

  return (
    <>
      <Card>
        <CardHeader title='Add New Course' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Title */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('title')} name='title' label='Enter Course Title' fullWidth />
                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-title-helper'>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Sub Title */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('subTitle')} name='subTitle' label='Course Search Keywords' fullWidth />
                {errors.subTitle && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-subTitle-helper'>
                    {errors.subTitle.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Slug */}
              <Grid marginTop={5} item xs={12} sm={8}>
                <TextField {...register('slug')} name='slug' label='Course slug' fullWidth />
                {errors.slug && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-slug-helper'>
                    {errors.slug.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Short Description */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <InputLabel id='description'>Short Description</InputLabel>
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
              {/* English Description */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <InputLabel id='englishDescription'>English Description</InputLabel>
                <Controller
                  name='englishDescription'
                  labelId='englishDescription'
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
              {/* Full Description */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <InputLabel id='abstract'>Full Description</InputLabel>
                <Controller
                  name='abstract'
                  labelId='abstract'
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

              {/* SEO */}
              <Grid
                marginTop={5}
                item
                xs={12}
                sm={12}
                sx={{ backgroundColor: '#f8f7fa', borderRadius: '5px', padding: '10px' }}
              >
                {/* SEO Keywords */}
                <Grid marginTop={5} item xs={12} sm={12}>
                  <InputLabel sx={{ marginBottom: 5 }}>SEO</InputLabel>
                  <TextField {...register('keywords')} name='keywords' label='SEO Keywords' fullWidth />
                  {errors.keywords && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-keywords-helper'>
                      {errors.keywords.message}
                    </FormHelperText>
                  )}
                </Grid>

                {/* SEO Meta Title */}
                <Grid marginTop={5} item xs={12} sm={12}>
                  <TextField {...register('metaTitle')} name='metaTitle' label='SEO Meta Title' fullWidth />
                  {errors.metaTitle && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaTitle-helper'>
                      {errors.metaTitle.message}
                    </FormHelperText>
                  )}
                </Grid>

                {/* SEO Meta Description */}
                <Grid marginTop={5} item xs={12} sm={12}>
                  <TextField
                    {...register('metaDescription')}
                    name='metaDescription'
                    label='SEO Meta Description'
                    fullWidth
                  />
                  {errors.metaDescription && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaDescription-helper'>
                      {errors.metaDescription.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              {/* Status */}
              <Grid marginTop={5} item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel id='status-select-label'>Status</InputLabel>
                  <Select {...register('status')} name='status' labelId='status-select-label' label='Status'>
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
              <Grid marginTop={5} item xs={12} sm={10}></Grid>

              {/* Type */}
              <Grid marginTop={5} item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel id='type-select-label'>Type</InputLabel>
                  <Select {...register('type')} name='type' labelId='type-select-label' label='type'>
                    <MenuItem value={'1'}>Online</MenuItem>
                    <MenuItem value={'0'}>Recorded</MenuItem>
                  </Select>
                </FormControl>
                {errors.type && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-type-helper'>
                    {errors.type.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid marginTop={5} item xs={12} sm={10}></Grid>

              {/* Intro URL */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('introURL')} name='introURL' label='Intro URL' fullWidth />
                {errors.introURL && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-introURL-helper'>
                    {errors.introURL.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Course Poster */}
              <Grid marginTop={5} item xs={12} sm={6} flex>
                {imageUrl ? (
                  <>
                    <img alt='Image' src={imageUrl} width='100' />
                    <br />
                  </>
                ) : null}

                <label>Course Poster</label>
                <TextField {...register('image')} type='file' name='image' fullWidth onChange={handleFileChange} />
                {errors.image && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-image-helper'>
                    {errors.image.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid marginTop={5} item xs={12} sm={6}></Grid>

              {/* Intro Poster */}
              <Grid marginTop={5} item xs={12} sm={6} flex>
                {videoImageUrl ? (
                  <>
                    <img alt='Image' src={videoImageUrl} width='100' />
                    <br />
                  </>
                ) : null}

                <label>Intro Poster</label>
                <TextField
                  {...register('introPoster')}
                  type='file'
                  name='introPoster'
                  fullWidth
                  onChange={handleVideoPhotoChange}
                />
                {errors.introPoster && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-introPoster-helper'>
                    {errors.introPoster.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid marginTop={5} item xs={12} sm={6}></Grid>

              {/* Certificate */}
              <Grid marginTop={5} item xs={12} sm={6} flex>
                {certificateURL ? (
                  <>
                    <img alt='Image' src={certificateURL} width='100' />
                    <br />
                  </>
                ) : null}

                <label>Certificate</label>
                <TextField
                  {...register('certificate')}
                  type='file'
                  name='certificate'
                  fullWidth
                  onChange={handleCertificateChange}
                />
                {errors.certificate && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-certificate-helper'>
                    {errors.certificate.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <Grid marginTop={10} item xs={12} sm={6}>
              <Button type='submit' size='large' variant='contained' color='success'>
                Submit
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
