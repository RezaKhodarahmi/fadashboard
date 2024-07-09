import { useEffect, Suspense, lazy, useState } from 'react'
import { Grid, Box, Button, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getTestWithId } from 'src/store/apps/test'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'

const EditForm = lazy(() => import('src/views/apps/test/edit'))

const Loading = () => (
  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
    <CircularProgress sx={{ mb: 4 }} />
    <Typography>Loading...</Typography>
  </Box>
)

export default function EditTest() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { id } = router.query
  const dispatch = useDispatch()
  const test = useSelector(state => state.test)
  const testData = test.data?.data
  const testQuestions = test.data?.questions || []
  const totalPages = test.data?.totalPages || 1
  const limit = 10

  useEffect(() => {
    if (testData) {
      setLoading(false)
    }
  }, [testData])

  useEffect(() => {
    if (id) {
      dispatch(getTestWithId(id, page, limit))
    }
  }, [dispatch, id, page])

  const handlePageChange = newPage => {
    setLoading(true)
    setPage(newPage)
  }

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
          subtitle={<Typography variant='body2'>{testData ? testData.name : 'Test title'}</Typography>}
        />
        {!loading && (
          <Grid item xs={12}>
            <Suspense fallback={<Loading />}>
              <EditForm testData={testData} testQuestions={testQuestions} />
            </Suspense>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
              Previous
            </Button>
            <Typography sx={{ mx: 2 }}>
              Page {page} of {totalPages}
            </Typography>
            <Button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
