import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const appointmentSlice = createSlice({
  name: 'appointment',
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

export const { getDataStart, getDataSuccess, getDataFailure } = appointmentSlice.actions

export const fetchEDData = () => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/appointment/ed`, {
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

export const fetchEXData = () => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/appointment/ex`, {
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

export const newEDAppointment = params => async dispatch => {
  dispatch(getDataStart())
  const token = window.localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${BASE_URL}/appointment/ed/create`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Appointment created successfully.')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))

    toast.error('Error! message:' + error?.response?.data?.message)
  }
}

export const newEXAppointment = params => async dispatch => {
  dispatch(getDataStart())
  const token = window.localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${BASE_URL}/appointment/ex/create`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Appointment created successfully.')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))

    toast.error('Error! message:' + error?.response?.data?.message)
  }
}

export const getEDAppointmentWithId = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/appointment/ed/${id}`, {
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

export const getEXAppointmentWithId = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/appointment/ex/${id}`, {
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

export const updateEDAppointment = (params, id) => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.patch(`${BASE_URL}/appointment/ed/update/${id}`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Appointment successfully updated!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.response?.data?.message))
  }
}

export const updateEXAppointment = (params, id) => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.patch(`${BASE_URL}/appointment/ex/update/${id}`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Appointment successfully updated!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.response?.data?.message))
  }
}

export const deleteEDAppointment = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.delete(`${BASE_URL}/appointment/ed/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Appointment successfully deleted!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.message))
  }
}

export const deleteEXAppointment = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.delete(`${BASE_URL}/appointment/ex/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Appointment successfully deleted!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.message))
  }
}

export default appointmentSlice.reducer
