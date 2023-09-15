import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import AppConfig from 'src/configs/appConfg'
import { Editor } from '@tinymce/tinymce-react'
import * as yup from 'yup'
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material'
import { newTest } from 'src/store/apps/test'
import { fetchData } from 'src/store/apps/course'
import { fetchCycleData } from 'src/store/apps/cycle'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  status: yup.string().required('Status is required'),
  cycleId: yup.string().required('Test cycle is required'),
  position: yup.number().required('Position is required'),
  repetition: yup.number().required('Repetition is required'),
  testTime: yup.number().nullable(true),
  testDate: yup.date('Only valid date is accept').nullable(true),
  needEnroll: yup.string().required('Need Enroll is required'),
  agenda: yup.string().nullable(true)
})

export default function EditForm() {
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

  //Set state
  const [courseId, setCourseId] = useState(null)
  const courses = useSelector(state => state.course)
  const cycles = useSelector(state => state.cycleListReducer)

  useEffect(() => {
    dispatch(fetchData())
    dispatch(fetchCycleData())
  }, [dispatch, courseId])

  const onSubmit = data => {
    dispatch(newTest(data))
  }

  const handelCourseSelect = e => {
    setCourseId(e.target.value)
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
          <TextField {...register('testTime')} label='Test Time(Min)' type='number' fullWidth />
          {errors.testTime && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-testTime-helper'>
              {errors.testTime.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('testDate')} label='Test Date' type='date' fullWidth />
          {errors.testDate && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-testTime-helper'>
              {errors.testDate.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <TextField {...register('repetition')} label='Allow repetition' type='number' fullWidth />
          {errors.repetition && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-repetition-helper'>
              {errors.repetition.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='enroll-select-label'>Need Enroll?</InputLabel>
            <Select {...register('needEnroll')} labelId='enroll-select-label' label='Need Enroll'>
              <MenuItem value={'1'}>Yes</MenuItem>
              <MenuItem value={'0'}>No</MenuItem>
            </Select>
          </FormControl>

          {errors.needEnroll && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-needEnroll-helper'>
              {errors.needEnroll.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid marginTop={5} item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='status-select-label'>Status</InputLabel>
            <Select {...register('status')} labelId='status-select-label' label='Status'>
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
          <TextField {...register('position')} label='Position' type='number' fullWidth />
          {errors.position && (
            <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-position-helper'>
              {errors.position.message}
            </FormHelperText>
          )}
        </Grid>

        <Grid marginTop={5} item xs={12} sm={6}>
          {courses.data.data ? (
            <FormControl fullWidth>
              <InputLabel id='courses-select-label'>Selet Course</InputLabel>
              <Select
                {...register('courseId')}
                labelId='enroll-select-label'
                label='Need Enroll'
                onChange={e => handelCourseSelect(e)}
              >
                {courses?.data?.data?.map(course => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
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
              <Select {...register('cycleId')} labelId='cycle-select-label' label='Select Cycle'>
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
        <Grid marginTop={5} item xs={12} sm={12}>
          <InputLabel id='Agenda'>Agenda</InputLabel>
          <Controller
            name='agenda'
            labelId='Agenda'
            control={control}
            rules={validationSchema.agenda}
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
  )
}
