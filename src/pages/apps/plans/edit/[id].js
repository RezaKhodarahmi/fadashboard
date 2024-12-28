// Edit Plan Component ([id].js)
import { useEffect, Suspense, lazy } from 'react';
import { Grid, Box } from '@mui/material';
import { useRouter } from 'next/router';

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { getPlanWithId } from 'src/store/apps/plans';
import CircularProgress from '@mui/material/CircularProgress';

const EditForm = lazy(() => import('src/views/apps/plans/edit'));

const Loading = () => {
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  );
};

export default function EditPlan() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const plan = useSelector(state => state.plans);
  const planData = plan.data?.data;

  useEffect(() => {
    if (id) {
      dispatch(getPlanWithId(id));
    }
  }, [dispatch, id]);

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className="match-height">
        <PageHeader
          title={
            <Typography variant="h5">
              <MuiLink href="https://github.com/react-hook-form/react-hook-form" target="_blank">
                Edit Plan
              </MuiLink>
            </Typography>
          }
          subtitle={<Typography variant="body2">{planData ? planData.title : 'Plan name'}</Typography>}
        />
        <Grid item xs={12}>
          <Suspense fallback={<Loading />}>
            <EditForm planData={planData} />
          </Suspense>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
}
