import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box
} from '@mui/material';
import * as yup from 'yup';
import { fetchEnrollmentWithId, updateEnrollment } from 'src/store/apps/enrollment';

const validationSchema = yup.object().shape({
  enrollmentDate: yup.date().required('Enrollment Date is required'),
  completionDate: yup.date().nullable(),
  status: yup.string().required('Status is required'),
  cancelled: yup.string().required('Cancelled status is required'),
  cancellationResult: yup.string().nullable()
});

const EditEnrollment = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const enrollmentData = useSelector((state) => state.enrollment);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      enrollmentDate: null,
      completionDate: null,
      status: '',
      cancelled: '',
      cancellationResult: ''
    }
  });

  useEffect(() => {
    setLoading(true);
    dispatch(fetchEnrollmentWithId(id)).then(() => setLoading(false));
  }, [id, dispatch]);

  useEffect(() => {
    if (enrollmentData?.data) {
      const { enrollmentDate, completionDate, status, cancelled, cancellationResult } = enrollmentData.data;
      setValue('enrollmentDate', enrollmentDate || null);
      setValue('completionDate', completionDate || null);
      setValue('status', status || '');
      setValue('cancelled', cancelled || '');
      setValue('cancellationResult', cancellationResult || '');
    }
  }, [enrollmentData, setValue]);

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(updateEnrollment({ ...data, id })).finally(() => setLoading(false));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Enrollment Date */}
          <Grid item xs={12} md={6}>
            <Controller
              name="enrollmentDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enrollment Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.enrollmentDate}
                  helperText={errors.enrollmentDate?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Completion Date */}
          <Grid item xs={12} md={6}>
            <Controller
              name="completionDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Completion Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.completionDate}
                  helperText={errors.completionDate?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                {...register('status')}
                labelId="status-select-label"
                label="Status"
                defaultValue=""
              >
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Cancelled */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.cancelled}>
              <InputLabel id="cancelled-select-label">Cancelled</InputLabel>
              <Select
                {...register('cancelled')}
                labelId="cancelled-select-label"
                label="Cancelled"
                defaultValue=""
              >
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
              <FormHelperText>{errors.cancelled?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Cancellation Result */}
          <Grid item xs={12}>
            <TextField
              {...register('cancellationResult')}
              label="Cancellation Result"
              fullWidth
              error={!!errors.cancellationResult}
              helperText={errors.cancellationResult?.message}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update Enrollment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditEnrollment;
