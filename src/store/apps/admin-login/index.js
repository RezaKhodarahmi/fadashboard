import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const adminLoginSlice = createSlice({
  name: 'adminLogin',
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
    },
    resetState(state) {
      state.data = []
      state.loading = false
      state.error = null
    }
  }
})

export const { getDataStart, getDataSuccess, getDataFailure, resetState } = adminLoginSlice.actions

export const adminLogin = params => async dispatch => {
  dispatch(resetState()) // Reset state before new login request
  dispatch(getDataStart())

  const token = window.localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${BASE_URL}/auth/admin/login`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Logged in successfully.')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))

    toast.error('Error! message:' + error?.response?.data?.message)
  }
}

export default adminLoginSlice.reducer
