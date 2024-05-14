import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const enrollmentSlice = createSlice({
  name: 'enrollment',
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

export const { getDataStart, getDataSuccess, getDataFailure } = enrollmentSlice.actions

export const fetchEnrollmentData = () => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/enrollment`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    console.log(response.data)
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))
  }
}

export const newEnrollment = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.post(`${BASE_URL}/enrollment/create`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    dispatch(getDataSuccess(response.data))
    toast.success('Successfully created')
  } catch (error) {
    dispatch(getDataFailure(error.message))
    toast.error('Error')
  }
}

export const fetchEnrollmentWithId = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/enrollment/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    toast.success('Successfully created')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))
  }
}

export const updateEnrollment = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.patch(`${BASE_URL}/enrollment/update`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    toast.success('Successfully updated!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)
    dispatch(getDataFailure(error.response?.data?.message))
  }
}

export const deleteEnrollment = id => async dispatch => {
  dispatch(getDataStart())

  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.delete(`${BASE_URL}/enrollment/delete/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Successfully deleted!')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.message))
  }
}

export default enrollmentSlice.reducer
