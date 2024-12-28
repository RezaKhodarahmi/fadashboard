import { useEffect, Suspense, lazy } from 'react'

import { Grid, Box } from '@mui/material'
import { useRouter } from 'next/router'
import { fetchList } from 'src/store/apps/activecampaing'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { getCourseWithId } from 'src/store/apps/course'
import CircularProgress from '@mui/material/CircularProgress'

const EditForm = lazy(() => import('src/views/apps/course/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function EditUser() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const course = useSelector(state => state.course)
  const activeList = useSelector(state => state.activecamp)

  const activeListData = activeList?.data.lists
  const courseData = course.data?.data
  const plan = course?.data?.plan

  useEffect(() => {
    if (id) {
      dispatch(getCourseWithId(id))
    }
  }, [dispatch, id])
  useEffect(() => {
    dispatch(fetchList())
  }, [dispatch])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='https://github.com/react-hook-form/react-hook-form' target='_blank'>
                Edit course
              </MuiLink>
            </Typography>
          }
          subtitle={<Typography variant='body2'>{courseData ? courseData.title : 'Course name'}</Typography>}
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm courseData={courseData} plan={plan} activeListData={activeListData} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
