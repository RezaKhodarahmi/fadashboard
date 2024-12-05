import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const zoomSlice = createSlice({
  name: 'zoom',
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

export const { getDataStart, getDataSuccess, getDataFailure } = zoomSlice.actions

export const fetchZoomLinks = cycleId => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/zoom-links`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      params: { cycleId },
      withCredentials: true
    })
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))
  }
}

export default zoomSlice.reducer
