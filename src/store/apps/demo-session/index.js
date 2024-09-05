import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const demoSessionSlice = createSlice({
  name: 'demosession',
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

export const { getDataStart, getDataSuccess, getDataFailure } = demoSessionSlice.actions

export const fetchDemosessionData =
  (page = 1, limit = 25, searchTerm = '') =>
  async dispatch => {
    console.log(searchTerm)
    dispatch(getDataStart())
    try {
      const token = window.localStorage.getItem('accessToken')

      const response = await axios.get(`${BASE_URL}/demosession`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
        params: { page, limit, searchTerm } // Pass page, limit, and searchTerm as query params
      })

      dispatch(
        getDataSuccess({
          data: response.data.data,
          total: response.data.total, // Pass total count to the reducer
          page,
          limit,
          courses: response.data.courses
        })
      )
    } catch (error) {
      dispatch(getDataFailure(error.message))
    }
  }

export default demoSessionSlice.reducer
