import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    getDataStart(state) {
      state.loading = true
      state.error = null
    },
    getDataSuccess(state, { payload }) {
      state.loading = false
      state.data = payload
    },
    getDataFailure(state, { payload }) {
      state.loading = false
      state.error = payload
    }
  }
})

export const { getDataStart, getDataSuccess, getDataFailure } = couponSlice.actions

export const fetchCoupons = () => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/coupon`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))
  }
}

export const newCoupon = params => async dispatch => {
  dispatch(getDataStart())

  const token = window.localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${BASE_URL}/coupon/create`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Coupon created successfully.')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))

    toast.error('Error! message:' + error?.response?.data?.message)
  }
}

export const getCouponWithId = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/coupon/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.message))
  }
}

export const updateCoupon = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.patch(`${BASE_URL}/coupon/update`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    toast.success('Coupon updated successfully!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.response?.data?.message))
  }
}

export const deleteCoupon = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.delete(`${BASE_URL}/coupon/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Coupon deleted successfully!')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.message))
  }
}

export default couponSlice.reducer
