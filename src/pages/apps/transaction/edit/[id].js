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
import { fetchTransactionWithId } from 'src/store/apps/transaction'
import CircularProgress from '@mui/material/CircularProgress'

const EditForm = lazy(() => import('src/views/apps/transaction/edit'))

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default function EditTransaction() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const transaction = useSelector(state => state.transaction)
  const transactionData = transaction.data.data

  useEffect(() => {
    if (id) {
      dispatch(fetchTransactionWithId(id))
    }
  }, [dispatch, id])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              <MuiLink href='#' target='_blank'>
                Edit Transaction
              </MuiLink>
            </Typography>
          }
          subtitle={
            <Typography variant='body2'>{transactionData ? transactionData.Transaction_ID : 'Transaction'}</Typography>
          }
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm transactionData={transactionData} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
