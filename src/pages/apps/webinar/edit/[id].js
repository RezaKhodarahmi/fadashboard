import { useEffect, Suspense, lazy } from 'react'

import { Grid, Box } from '@mui/material'
import { useRouter } from 'next/router'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { getWebinarWithId } from 'src/store/apps/webinar'
import CircularProgress from '@mui/material/CircularProgress'

const EditForm = lazy(() => import('src/views/apps/webinar/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function EditWebinar() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const webinar = useSelector(state => state.webinar)
  const webinarData = webinar.data?.data

  useEffect(() => {
    if (id) {
      dispatch(getWebinarWithId(id))
    }
  }, [dispatch, id])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='https://github.com/react-hook-form/react-hook-form' target='_blank'>
                Edit Webinar
              </MuiLink>
            </Typography>
          }
          subtitle={<Typography variant='body2'>{webinarData ? webinarData.title : 'Webinar name'}</Typography>}
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm webinarData={webinarData} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
