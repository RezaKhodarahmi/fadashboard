import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

export const listInitialState = {
  data: [],
  loading: false,
  error: null
}

const cycleSlice = createSlice({
  name: 'cycle',
  initialState,
  reducers: {
    getDataStart(state) {
      state.loading = true
      state.error = null
      state.data = null
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

export const { getDataStart, getDataSuccess, getDataFailure } = cycleSlice.actions

const cycleListSlice = createSlice({
  name: 'cycleList',
  initialState: listInitialState,
  reducers: {
    listGetDataStart(state) {
      state.loading = true
      state.error = null
      state.data = null
    },
    listGetDataSuccess(state, { payload }) {
      state.loading = false
      state.data = payload
    },
    listGetDataFailure(state, { payload }) {
      state.loading = false
      state.error = payload
    }
  }
})

export const { listGetDataStart, listGetDataSuccess, listGetDataFailure } = cycleListSlice.actions

export const fetchCycleData = () => async dispatch => {
  dispatch(listGetDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/cycles`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    dispatch(listGetDataSuccess(response.data))
  } catch (error) {
    dispatch(listGetDataFailure(error.message))
  }
}

export const getCourseCycles = courseId => async dispatch => {
  dispatch(listGetDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/cycles/course-cycle/${courseId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    dispatch(listGetDataSuccess(response.data))
  } catch (error) {
    dispatch(listGetDataFailure(error.message))
  }
}

export const newCycle = params => async dispatch => {
  dispatch(getDataStart())
  const token = window.localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${BASE_URL}/cycles/create`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Cycle created successfully.')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error.message))

    toast.error('Error! message:' + error?.response?.data?.message)
  }
}

export const getCycleWithId = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/cycles/${id}`, {
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

export const updateCycle = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.patch(`${BASE_URL}/cycles/update`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    toast.success('Successfully updated!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    dispatch(getDataFailure(error?.response?.data?.message))
  }
}

export const deleteCycle = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.delete(`${BASE_URL}/cycles/delete/${id}`, {
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

export const cycleReducer = cycleSlice.reducer

export const cycleListReducer = cycleListSlice.reducer
