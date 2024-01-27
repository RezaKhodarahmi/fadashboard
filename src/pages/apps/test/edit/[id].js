import React, { Suspense, lazy } from 'react'
import { Grid, Box, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import BASE_URL from 'src/api/BASE_URL'
import axios from 'axios'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'

const EditForm = lazy(() => import('src/views/apps/test/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

// getServerSideProps function to fetch data server-side
export async function getServerSideProps(context) {
  const { id } = context.params

  try {
    const response = await axios.get(`${BASE_URL}/tests/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })

    // Return only the data needed for the page, not the entire response object
    return { props: { testData: response.data } }
  } catch (error) {
    return { props: { error: 'Error fetching data' } }
  }
}

export default function EditVideo({ testData }) {
  const test = testData.data
  const testQuestions = testData.questions

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='https://github.com/react-hook-form/react-hook-form' target='_blank'>
                Edit Test
              </MuiLink>
            </Typography>
          }
          subtitle={<Typography variant='body2'>{test ? test.name : 'Test title'}</Typography>}
        />

        <Grid item xs={12}>
          {test && (
            <Suspense fallback={<Loading />}>
              <EditForm testData={test} testQuestions={testQuestions} />
            </Suspense>
          )}
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
