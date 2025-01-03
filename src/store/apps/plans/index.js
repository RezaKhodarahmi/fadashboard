import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const planSlice = createSlice({
  name: 'plans',
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

export const { getDataStart, getDataSuccess, getDataFailure } = planSlice.actions

export const fetchPlansData = () => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/plans`, {
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

export const newPlan = params => async dispatch => {
  dispatch(getDataStart())

  const token = window.localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${BASE_URL}/plans/create`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Plan created successfully.')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))

    toast.error('Error! message:' + error?.response?.data?.message)
  }
}

export const getPlanWithId = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/plans/${id}`, {
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

export const updatePlan = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.patch(`${BASE_URL}/plans/update/${params.id}`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    toast.success('Plan updated successfully!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.response?.data?.message))
  }
}

export const deletePlan = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.delete(`${BASE_URL}/plans/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Plan deleted successfully!')
    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)

    dispatch(getDataFailure(error.message))
  }
}

export default planSlice.reducer
