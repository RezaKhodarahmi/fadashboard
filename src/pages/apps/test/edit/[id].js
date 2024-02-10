import { useEffect, Suspense, lazy, useState } from 'react'

import { Grid, Box } from '@mui/material'
import { useRouter } from 'next/router'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { getTestWithId } from 'src/store/apps/test'
import CircularProgress from '@mui/material/CircularProgress'

const EditForm = lazy(() => import('src/views/apps/test/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function EditVideo() {
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const [page, setPage] = useState(1)

  const { id } = router.query
  const dispatch = useDispatch()
  const test = useSelector(state => state.test)
  const testData = test.data?.data
  const testQuestions = test.data?.questions || []

  const limit = 20

  useEffect(() => {
    if (id) {
      dispatch(getTestWithId(id, page, limit))
    }
  }, [dispatch, id, page])

  useEffect(() => {
    if (questions.length) {
      const oldQuestions = [...questions]
      const newQuestions = oldQuestions.push(testQuestions)

      setQuestions(newQuestions)
    } else {
      setQuestions(testQuestions)
    }
  }, [test])

  const setNewPage = () => {
    setPage(prevPage => prevPage + 1)
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
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm testData={testData} testQuestions={questions} setNewPage={setNewPage} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
