// ** React Imports
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'

import FaqForm from '../faq'
import { Editor } from '@tinymce/tinymce-react'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import AppConfig from 'src/configs/appConfg'

// ** MUI Imports
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
  Box,
  Badge
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Accordion from '@mui/material/Accordion'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import FormControlLabel from '@mui/material/FormControlLabel'
import AccordionDetails from '@mui/material/AccordionDetails'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { updateCourse, deleteCourseCategory } from 'src/store/apps/course'
import { getTeachers } from 'src/store/apps/user'
import { newCycle, updateCycle, getCourseCycles, deleteCycle } from 'src/store/apps/cycle'
import { fetchPlansData } from 'src/store/apps/plans'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { MultiSelect } from 'react-multi-select-component'
import { fetchData } from 'src/store/apps/category'
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
  accessAll: yup.string().oneOf(['1', '0'], 'Invalid Access status').required('Access status is required'),
  activeList: yup.string().required('Select course list'),
  teacher: yup.string().required('Select Teacher is required'),
  type: yup.string().oneOf(['2', '1', '0'], 'Invalid type').required('Type is required'),
  introURL: yup.string().url('Must be a valid URL').nullable().notRequired()
})

export default function EditForm(props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const router = useRouter()
  const { register: register2, handleSubmit: handleSubmit2, errors: errors2 } = useForm()
  const [cycles, setCycles] = useState([])
  const dispatch = useDispatch()
  const cycle = useSelector(state => state.cycleReducer)
  const courseCycles = useSelector(state => state.cycleListReducer)
  const allCategories = useSelector(state => state.categoryListReducer)
  const plans = useSelector(state => state.plans.data)

  // Set state
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [accessAll, setAccess] = useState(null)
  const [courseId, setCourseId] = useState(null)
  const [type, setType] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [activeCampList, setActiveCampList] = useState([])
  const [selectedActiveList, setSelectedActiveList] = useState('0')
  const [isApiLoaded, setIsApiLoaded] = useState(true)
  const [file, setFile] = useState(null)
  const [certificateFile, setCertificateFile] = useState(null)
  const [cycleSubmit, setCycleSubmit] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [certificateURL, setCertificateURL] = useState(null)
  const [categoryId, setCategoryId] = useState([{ label: 'Select category', value: '0' }])
  const [videoImageFile, setVideoImageFile] = useState(null)
  const [videoImageUrl, setVideoImageUrl] = useState(null)
  const [featured, setFeatured] = useState(null)
  const [selectedPlanId, setSelectedPlanId] = useState(null)

  // Get teachers from API
  const user = useSelector(state => state.user)

  const [isPlansLoading, setIsPlansLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      setIsPlansLoading(true)
      await dispatch(fetchPlansData())
      setIsPlansLoading(false)
    }
    fetchPlans()
  }, [dispatch])

  useEffect(() => {
    if (props.plan) {
      setSelectedPlanId(props?.plan?.planId)
    }
  }, [dispatch, props.plan])

  const handlePlanChange = event => {
    setSelectedPlanId(event.target.value)
  }
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

  useEffect(() => {
    dispatch(fetchData())
    dispatch(getTeachers())
  }, [dispatch])

  useEffect(() => {
    const newCycles = []
    courseCycles?.data?.data?.forEach(item => {
      newCycles.push(item)
    })
    setCycles(newCycles)
    setIsApiLoaded(true)
  }, [courseCycles])

  useEffect(() => {
    if (cycle.data?.data?.id >= 1) {
      const secId = cycle.data.data.secId
      const result = cycles.find(item => item.secId === secId)
      if (result) {
        result.id = cycle.data?.data?.id
        result.display = true
      }
      setIsApiLoaded(true)
    }
  }, [cycle])

  useEffect(() => {
    setActiveCampList(props.activeListData)
  }, [props])

  useEffect(() => {
    if (props.courseData) {
      const { categories, cycles, teachers, ...rest } = props.courseData
      reset(rest)
      setAccess(props.courseData.accessAll)
      setStatus(props.courseData.status)
      setType(props.courseData.type)
      setFeatured(props.courseData.featured)
      setImageUrl(props.courseData.image)
      setSelectedActiveList(props.courseData.activeList)
      setCertificateURL(props.courseData.certificate)
      setVideoImageUrl(props.courseData.introPoster)
      setCourseId(props.courseData.id)
      if (teachers && teachers.length) {
        setTeacher(teachers[0])
        setLoading(false)
      } else {
        setTeacher('1')
      }
      setCategoryId(
        categories?.map(cat => {
          return {
            label: cat.title,
            value: cat.id
          }
        })
      )
    }
  }, [props.courseData, reset, teacher])

  const showCategories = allCategories?.data?.data?.map(cat => {
    return {
      label: cat.title,
      value: cat.id
    }
  }) || {
    label: 'uncategorized',
    value: '0'
  }

  const handleCreateCycle = () => {
    const newCycles = [...cycles]
    newCycles.push({
      secId: newCycles.length + 1,
      id: null,
      name: `Cycle ${newCycles.length + 1}`,
      startDate: null,
      endDate: null,
      vacationStart: null,
      vacationEnd: null,
      regularPrice: '0',
      time: '20:00',
      days: 'Sundays/Mondays',
      duration: '20 hours',
      groupLink: '',
      zoomLink: '',
      zoomId: '',
      zoomSecret: '',
      zoomAccId: '',
      vipPrice: '0',
      certificate: '',
      vipAccess: '0',
      retake: '0',
      status: '0',
      srt_publish: '0'
    })
    setIsApiLoaded(false)
    setCycles(newCycles)
    setCycleSubmit(true)
  }

  useEffect(() => {
    if (courseId != null) {
      dispatch(getCourseCycles(courseId))
    }
  }, [dispatch, courseId])

  useEffect(() => {
    if (cycles.length >= 1 && cycleSubmit) {
      dispatch(newCycle({ ...cycles, courseId }))
      setCycleSubmit(false)
    }
  }, [cycles, courseId])

  const handleDeleteCycle = id => {
    const confirmation = window.confirm('Do you really want to DELETE the cycle?')
    if (confirmation) {
      setIsApiLoaded(false)
      dispatch(deleteCycle(id))
      dispatch(getCourseCycles(courseId))
      router.reload(window.location.pathname)
    }
  }

  const onSubmit2 = data => {
    const newCycles = [...cycles]
    const cycleIndex = newCycles.findIndex(cycle => cycle.secId === data.secId)
    const cycleToUpdate = { ...newCycles[cycleIndex] }

    dispatch(updateCycle(data))
  }

  const handelRemoveCategory = catId => {
    const confirmation = window.confirm('Do you really want to remove Category?')
    if (confirmation) {
      const oldCats = [...categoryId]
      if (oldCats?.length > 1) {
        const newCat = oldCats.filter(cat => cat.value != catId)
        dispatch(deleteCourseCategory({ catId: catId, courseId: courseId }))
        setCategoryId(newCat)
      } else {
        window.alert("Can't remove the default category, first select a category.")
      }
    }
  }

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
    formData.append('cats', JSON.stringify(categoryId))
    formData.append('planId', selectedPlanId)
    dispatch(updateCourse(formData))
  }

  if (!isApiLoaded) {
    return <div>Loading...</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Card>
        <CardHeader title='Edit Post' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type='hidden' {...register('id')} />
            <Grid container spacing={2}>
              {/* Title */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('title')} name='title' label='Course Title' focused fullWidth />
                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-title-helper'>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Search Title */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('subTitle')} name='subTitle' label='Course Search Title' focused fullWidth />
                {errors.subTitle && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-subTitle-helper'>
                    {errors.subTitle.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Slug */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('slug')} name='slug' label='Course Slug' focused fullWidth />
                {errors.slug && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-slug-helper'>
                    {errors.slug.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Description */}
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

              {/* Abstract */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <InputLabel id='abstract'>Abstract</InputLabel>
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
                {/* Keywords */}
                <Grid marginTop={5} item xs={12} sm={12}>
                  <InputLabel sx={{ marginBottom: 5 }}>SEO</InputLabel>
                  <TextField {...register('keywords')} name='keywords' label='Course Keywords' focused fullWidth />
                  {errors.keywords && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-keywords-helper'>
                      {errors.keywords.message}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Meta Title */}
                <Grid marginTop={5} item xs={12} sm={12}>
                  <TextField {...register('metaTitle')} name='metaTitle' label='Course Meta Title' focused fullWidth />
                  {errors.metaTitle && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaTitle-helper'>
                      {errors.metaTitle.message}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Meta Description */}
                <Grid marginTop={5} item xs={12} sm={12}>
                  <TextField
                    {...register('metaDescription')}
                    name='metaDescription'
                    label='Course Meta Description'
                    focused
                    fullWidth
                  />
                  {errors.metaDescription && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaDescription-helper'>
                      {errors.metaDescription.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              {isPlansLoading ? (
                <Grid item xs={12}>
                  <Typography>Loading plans...</Typography>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='plan-select-label'>Select Partially Plan</InputLabel>
                    <Select
                      labelId='plan-select-label'
                      value={selectedPlanId || ''}
                      onChange={handlePlanChange}
                      required
                    >
                      <MenuItem value='' disabled>
                        Select a Plan
                      </MenuItem>
                      {plans?.data?.map(plan => (
                        <MenuItem key={plan.id} value={plan.id}>
                          {plan.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.planId && <FormHelperText error>{errors.planId.message}</FormHelperText>}
                </Grid>
              )}

              {/* status */}
              <Grid marginTop={5} item xs={12} sm={2}>
                {status != null ? (
                  <FormControl fullWidth>
                    <InputLabel id='status-select-label'>Status</InputLabel>
                    <Select
                      {...register('status')}
                      name='status'
                      labelId='status-select-label'
                      label='Status'
                      defaultValue={status}
                    >
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

              {/* featured */}
              <Grid marginTop={5} item xs={12} sm={2}>
                {featured != null ? (
                  <FormControl fullWidth>
                    <InputLabel id='status-select-label'>Featured</InputLabel>
                    <Select
                      {...register('featured')}
                      name='featured'
                      labelId='featured-select-label'
                      label='Featured'
                      defaultValue={featured}
                    >
                      <MenuItem value={'1'}>Yes</MenuItem>
                      <MenuItem value={'0'}>no</MenuItem>
                    </Select>
                  </FormControl>
                ) : null}
                {errors.featured && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-featured-helper'>
                    {errors.featured.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* access all users to materials */}
              <Grid marginTop={5} item xs={12} sm={2}>
                {accessAll != null ? (
                  <FormControl fullWidth>
                    <InputLabel id='accessAll-select-label'>Access All materials</InputLabel>
                    <Select
                      {...register('accessAll')}
                      name='accessAll'
                      labelId='accessAll-select-label'
                      label='accessAll'
                      defaultValue={accessAll}
                    >
                      <MenuItem value={'1'}>Yes</MenuItem>
                      <MenuItem value={'0'}>no</MenuItem>
                    </Select>
                  </FormControl>
                ) : null}
                {errors.accessAll && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-accessAll-helper'>
                    {errors.accessAll.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* List Number */}
              <Grid item xs={12} sm={2} marginTop={5}>
                <TextField
                  {...register('activeList')}
                  name='activeList'
                  type='number'
                  label='ActiveCamping list number'
                  fullWidth
                />

                {errors.activeList && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-activeList-helper'>
                    {errors.activeList.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Type */}
              <Grid marginTop={5} item xs={12} sm={2}>
                {type != null ? (
                  <FormControl fullWidth>
                    <InputLabel id='type-select-label'>Type</InputLabel>
                    <Select
                      {...register('type')}
                      name='type'
                      labelId='type-select-label'
                      label='type'
                      defaultValue={type}
                    >
                      <MenuItem value={'1'}>Online</MenuItem>
                      <MenuItem value={'0'}>Recorded</MenuItem>
                      <MenuItem value={'2'}>Workshop</MenuItem>
                    </Select>
                  </FormControl>
                ) : null}
                {errors.type && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-type-helper'>
                    {errors.type.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid marginTop={5} item xs={12} sm={10}></Grid>

              {/* Category */}
              {categoryId != null ? (
                <Grid marginTop={5} item xs={12} sm={6} style={{ zIndex: '999' }}>
                  <InputLabel id='category-select-label'>Category</InputLabel>
                  <MultiSelect
                    options={showCategories}
                    value={categoryId}
                    onChange={setCategoryId}
                    labelledBy='category-select-label'
                  />
                  <Grid marginTop={5} xs={12} sm={12}>
                    {categoryId?.map(cat => (
                      <Button
                        color='primary'
                        key={cat.value}
                        onClick={e => handelRemoveCategory(cat.value)}
                        style={{ backgroundColor: 'rgb(115 100 240 / 11%)', margin: '0 5px' }}
                      >
                        {cat.label} <span className='badge  badge-sm' style={{ margin: '10px' }}></span>
                        <Badge badgeContent={'x'} color='primary' />
                      </Button>
                    ))}
                  </Grid>
                  {errors.category && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-category-helper'>
                      {errors.category.message}
                    </FormHelperText>
                  )}
                </Grid>
              ) : null}
              <Grid marginTop={5} item xs={12} sm={6}></Grid>

              {/* Teacher */}
              {teacher ? (
                <Grid marginTop={5} item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='type-select-label'>Teacher</InputLabel>
                    <Select
                      {...register('teacher')}
                      name='teacher'
                      labelId='teacher-select-label'
                      label='Teacher'
                      defaultValue={teacher?.id}
                    >
                      <MenuItem value={null}>Select a teacher</MenuItem>
                      {Array.isArray(user?.data?.data) &&
                        user?.data?.data?.map(teacher => (
                          <MenuItem key={teacher.id} value={teacher.id}>
                            {teacher.firstName + ' ' + teacher.lastName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {errors.teacher && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-teacher-helper'>
                      {errors.teacher.message}
                    </FormHelperText>
                  )}
                </Grid>
              ) : null}

              {/* Intro URL */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('introURL')} name='introURL' label='Intro URL' focused fullWidth />
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
                <TextField type='file' name='image' fullWidth onChange={handleFileChange} />
                {errors.image && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-image-helper'>
                    {errors.image.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Intro Poster */}
              <Grid marginTop={5} item xs={12} sm={6} flex>
                {videoImageUrl ? (
                  <>
                    <img alt='Image' src={videoImageUrl} width='100' />
                    <br />
                  </>
                ) : null}

                <label>Intro Poster</label>
                <TextField type='file' name='introPoster' fullWidth onChange={handleVideoPhotoChange} />
                {errors.introPoster && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-introPoster-helper'>
                    {errors.introPoster.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Certificate */}
              <Grid marginTop={5} item xs={12} sm={6} flex>
                {certificateURL ? (
                  <>
                    <img alt='Image' src={certificateURL} width='100' />
                    <br />
                  </>
                ) : null}

                <label>Certificate</label>
                <TextField type='file' name='certificate' fullWidth onChange={handleCertificateChange} />
                {errors.certificate && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-certificate-helper'>
                    {errors.certificate.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid marginTop={10} item xs={12} sm={12}>
              <Button type='submit' size='large' variant='contained' color='success'>
                Update
              </Button>
            </Grid>
          </form>

          <Grid marginTop={5} item xs={12} sm={12} flex>
            {isApiLoaded
              ? cycles.map((cycle, index) => {
                  return (
                    <>
                      <Accordion sx={{ marginTop: '2rem' }}>
                        <AccordionSummary
                          id='panel-header-1'
                          aria-controls='panel-content-1'
                          expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
                        >
                          <Typography sx={{ textTransform: 'uppercase' }}>Cycle: {cycle.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* Form */}
                          <form
                            key={cycle.id}
                            style={{
                              background: '#fff',
                              marginBottom: '1rem',
                              borderRadius: '15px',
                              padding: '10px 10px'
                            }}
                            onSubmit={handleSubmit2(onSubmit2)}
                          >
                            <TextField
                              style={{ display: 'none' }}
                              {...register2(`cycles.${index}.id`)}
                              defaultValue={cycle.id}
                              label='id'
                              type='hidden'
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                            <TextField
                              style={{ display: 'none' }}
                              {...register2(`cycles.${index}.secId`)}
                              defaultValue={cycle.secId}
                              label='secId'
                              type='hidden'
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                            <Grid key={cycle.secId} container sx={{ border: 0 }} spacing={2}>
                              <Grid item xs={12} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.name`)}
                                  defaultValue={cycle.name}
                                  label='Cycle Name'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.startDate`)}
                                  defaultValue={cycle.startDate}
                                  label='Start Date'
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.time`)}
                                  defaultValue={cycle.time}
                                  label='Course time'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.days`)}
                                  defaultValue={cycle.days}
                                  label='Course days'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.duration`)}
                                  defaultValue={cycle.duration}
                                  label='Course duration'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.groupLink`)}
                                  defaultValue={cycle.groupLink}
                                  label='Group Link'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.zoomLink`)}
                                  defaultValue={cycle.zoomLink}
                                  label='Zoom Link'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.zoomId`)}
                                  defaultValue={cycle.zoomId}
                                  label='Zoom Account ID'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.zoomSecret`)}
                                  defaultValue={cycle.zoomSecret}
                                  label='Zoom Account Secret'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.zoomAccId`)}
                                  defaultValue={cycle.zoomAccId}
                                  label='Zoom Account Number'
                                  type='text'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.endDate`)}
                                  defaultValue={cycle.endDate}
                                  label='End Date'
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.vacationStart`)}
                                  defaultValue={cycle.vacationStart}
                                  label='Vacation Start'
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.vacationEnd`)}
                                  defaultValue={cycle.vacationEnd}
                                  label='Vacation End'
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.regularPrice`)}
                                  defaultValue={cycle.regularPrice}
                                  label='Regular Price'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.vipPrice`)}
                                  defaultValue={cycle.vipPrice}
                                  label='VIP Price'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.vipPLPrice`)}
                                  defaultValue={cycle.vipPLPrice}
                                  label='VIP PL Price'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.discountPrice`)}
                                  defaultValue={cycle.discountPrice}
                                  label='Discount Price'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.discountVipPLPrice`)}
                                  defaultValue={cycle.discountVipPLPrice}
                                  label='Discount VIP PL Price'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.discountVipPrice`)}
                                  defaultValue={cycle.discountVipPrice}
                                  label='Discount VIP Price'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.discountDate`)}
                                  defaultValue={cycle.discountDate}
                                  label='Discount date start'
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.discountDateEnd`)}
                                  defaultValue={cycle.discountDateEnd}
                                  label='Discount date End'
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <FormControl fullWidth>
                                  <InputLabel id='vipAccess-select-label'>VIP Free Access</InputLabel>
                                  <Select
                                    {...register2(`cycles.${index}.vipAccess`)}
                                    defaultValue={cycle.vipAccess}
                                    labelId='vipAccess-select-label'
                                    label='VIP Free Access'
                                  >
                                    <MenuItem value={'1'}>Active</MenuItem>
                                    <MenuItem value={'0'}>Inactive</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <FormControl fullWidth>
                                  <InputLabel id='srt_publish-select-label'>Publish certificate</InputLabel>
                                  <Select
                                    {...register2(`cycles.${index}.srt_publish`)}
                                    defaultValue={cycle.srt_publish}
                                    labelId='srt_publish-select-label'
                                    label='Publish certificate'
                                  >
                                    <MenuItem value={'1'}>Yes</MenuItem>
                                    <MenuItem value={'0'}>No</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <TextField
                                  {...register2(`cycles.${index}.retake`)}
                                  defaultValue={cycle.retake}
                                  label='Retake'
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} marginTop={5}>
                                <FormControl fullWidth>
                                  <InputLabel id='status-select-label'>Status</InputLabel>
                                  <Select
                                    {...register2(`cycles.${index}.status`)}
                                    defaultValue={cycle.status}
                                    labelId='status-select-label'
                                    label='Status'
                                  >
                                    <MenuItem value={'1'}>Active</MenuItem>
                                    <MenuItem value={'0'}>Inactive</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid margin={10} item xs={12} sm={6}>
                                <Button type='submit' size='large' variant='contained' color='success'>
                                  Save Cycle
                                </Button>
                              </Grid>
                              <Grid margin={10} item xs={12} sm={6}>
                                <Button
                                  type='button'
                                  size='small'
                                  variant='contained'
                                  color='primary'
                                  onClick={e => handleDeleteCycle(cycle.id)}
                                >
                                  Delete Cycle
                                </Button>
                              </Grid>
                            </Grid>
                          </form>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )
                })
              : null}

            <Button
              type='button'
              size='large'
              variant='contained'
              color='primary'
              onClick={handleCreateCycle}
              sx={{ marginTop: '2rem' }}
            >
              Create new Cycle
            </Button>
          </Grid>
          <FaqForm courseId={courseId} />
        </CardContent>
      </Card>
    </>
  )
}
