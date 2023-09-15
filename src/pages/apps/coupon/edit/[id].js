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
import { getCouponWithId } from 'src/store/apps/coupon'
import CircularProgress from '@mui/material/CircularProgress'

const EditForm = lazy(() => import('src/views/apps/coupon/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function EditCoupon() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const coupon = useSelector(state => state.coupon)
  const couponData = coupon?.data?.data

  useEffect(() => {
    if (id) {
      dispatch(getCouponWithId(id))
    }
  }, [dispatch, id])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='#' target='_blank'>
                Edit Coupon
              </MuiLink>
            </Typography>
          }
          subtitle={<Typography variant='body2'>{couponData ? couponData.code : 'Code'}</Typography>}
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm couponData={couponData} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
