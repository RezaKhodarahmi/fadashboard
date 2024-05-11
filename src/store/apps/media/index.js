import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const mediaSlice = createSlice({
  name: 'media',
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

export const { getDataStart, getDataSuccess, getDataFailure } = mediaSlice.actions

export const fetchAllMedia = () => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/media/`, {
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

export const createNewMedia = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.post(`${BASE_URL}/media/new`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const deleteMedia = id => async dispatch => {
  dispatch(getDataStart())
  

  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.delete(`${BASE_URL}/media/delete/${id}`, {
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

export default mediaSlice.reducer
