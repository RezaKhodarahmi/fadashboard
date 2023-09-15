import { Suspense, lazy } from 'react'

import { Grid, Box } from '@mui/material'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const NewWebinarForm = lazy(() => import('src/views/apps/webinar/new'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function NewPost() {
  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='#' target='_blank'>
                New Webinar
              </MuiLink>
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <NewWebinarForm />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
