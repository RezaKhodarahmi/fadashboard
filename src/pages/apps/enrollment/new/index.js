import { Suspense, lazy } from 'react'

import { Grid, Box } from '@mui/material'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const NewEnrollForm = lazy(() => import('src/views/apps/enrollment/new'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function NewEnroll() {
  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='#' target='_blank'>
                New Enrollment
              </MuiLink>
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <NewEnrollForm />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
