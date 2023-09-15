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
import { getCategoryWithId } from 'src/store/apps/category'
import CircularProgress from '@mui/material/CircularProgress'

const EditForm = lazy(() => import('src/views/apps/category/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function EditCategory() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const category = useSelector(state => state.categoryReducer)
  const categoryData = category.data?.data

  useEffect(() => {
    if (id) {
      dispatch(getCategoryWithId(id))
    }
  }, [dispatch, id])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='https://github.com/react-hook-form/react-hook-form' target='_blank'>
                Edit Category
              </MuiLink>
            </Typography>
          }
          subtitle={<Typography variant='body2'>{categoryData ? categoryData.title : 'Category name'}</Typography>}
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm categoryData={categoryData} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
