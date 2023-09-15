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
import { getPostWithId } from 'src/store/apps/post'
import CircularProgress from '@mui/material/CircularProgress'

const EditForm = lazy(() => import('src/views/apps/post/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function EditPost() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const post = useSelector(state => state.posts)
  const postData = post.data?.data

  useEffect(() => {
    if (id) {
      dispatch(getPostWithId(id))
    }
  }, [dispatch, id])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='https://github.com/react-hook-form/react-hook-form' target='_blank'>
                Edit Blog Post
              </MuiLink>
            </Typography>
          }
          subtitle={<Typography variant='body2'>{postData ? postData.title : 'Post name'}</Typography>}
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm postData={postData} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
