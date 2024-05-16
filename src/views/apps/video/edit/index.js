import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { updateVideo } from 'src/store/apps/video'
import { fetchData } from 'src/store/apps/course'
import { fetchCycleData } from 'src/store/apps/cycle'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  url: yup.string().required('URL is required'),
  needEnroll: yup.string().required('Need Enroll is required')
})

export default function EditForm(props) {
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
  const [needEnroll, setNeedEnroll] = useState(null)
  const [courseId, setCourseId] = useState(null)
  const [cycleId, setCycleId] = useState(null)
  const courses = useSelector(state => state.course)
  const cycles = useSelector(state => state.cycleListReducer)

  useEffect(() => {
    dispatch(fetchData())
    dispatch(fetchCycleData())
  }, [dispatch, courseId])

  useEffect(() => {
    if (props.videoData) {
      reset(props.videoData)
      setNeedEnroll(props.videoData.needEnroll)
      setCourseId(props.videoData.courseId)
      setCycleId(props.videoData.cycleId)
    }
  }, [props])

  const onSubmit = data => {
    dispatch(updateVideo(data))
  }

  const handelCourseSelect = e => {
    setCourseId(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type='hidden' {...register('id')} />
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
          <TextField {...register('url')} label='URL' fullWidth />
          {errors.url && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-url-helper'>
              {errors.url.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          {needEnroll ? (
            <FormControl fullWidth>
              <InputLabel id='enroll-select-label'>Need Enroll?</InputLabel>
              <Select
                {...register('needEnroll')}
                defaultValue={needEnroll}
                labelId='enroll-select-label'
                label='Need Enroll'
              >
                <MenuItem value={'1'}>Yes</MenuItem>
                <MenuItem value={'0'}>No</MenuItem>
              </Select>
            </FormControl>
          ) : null}
          {errors.needEnroll && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-needEnroll-helper'>
              {errors.needEnroll.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('secId')} label='secId' type='number' fullWidth />
          {errors.secId && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-secId-helper'>
              {errors.secId.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('time')} label='Time (min)' type='number' fullWidth />
          {errors.time && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-time-helper'>
              {errors.time.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          {courses.data.data && courseId ? (
            <FormControl fullWidth>
              <InputLabel id='courses-select-label'>Selet Course</InputLabel>
              <Select
                {...register('courseId')}
                labelId='enroll-select-label'
                label='Need Enroll'
                defaultValue={courseId}
                onChange={e => handelCourseSelect(e)}
              >
                {courses.data.data?.map(course => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title +
                      ' ' +
                      '(' +
                      course?.teachers[0]?.firstName +
                      ' ' +
                      course?.teachers[0]?.lastName +
                      ')'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </Grid>
        {courseId ? (
          <Grid marginTop={5} item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='cycle-select-label'>Select Course Cycle</InputLabel>
              <Select {...register('cycleId')} defaultValue={cycleId} labelId='cycle-select-label' label='Select Cycle'>
                {cycles.data?.data
                  ?.filter(cycle => cycle.courseId == courseId)
                  .map(cycle => (
                    <MenuItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        ) : null}
      </Grid>
      <Grid marginTop={10} item xs={12} sm={6}>
        <Button type='submit' size='large' variant='contained' color='success'>
          Update
        </Button>
      </Grid>
    </form>
  )
}
