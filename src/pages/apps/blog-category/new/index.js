import { Suspense, lazy } from 'react'
import { Grid, Box } from '@mui/material'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const NewCategoryForm = lazy(() => import('src/views/apps/blog-category/new'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function NewCategory() {
  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='https://github.com/react-hook-form/react-hook-form' target='_blank'>
                New category
              </MuiLink>
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <NewCategoryForm />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
