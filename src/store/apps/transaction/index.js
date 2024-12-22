import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'
import BASE_URL from 'src/api/BASE_URL'

export const initialState = {
  data: [],
  loading: false,
  error: null
}

const transactionSlice = createSlice({
  name: 'transaction',
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

export const { getDataStart, getDataSuccess, getDataFailure } = transactionSlice.actions

export const fetchTransactionData =
  (
    page = 1,
    limit = 25,
    searchTerm = '',
    selectedStatus = 'succeeded',
    selectedType = '',
    exportStartDate = '',
    exportEndDate = ''
  ) =>
  async dispatch => {
    dispatch(getDataStart())
    try {
      const token = window.localStorage.getItem('accessToken')

      const response = await axios.get(`${BASE_URL}/transaction`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: { page, limit, searchTerm, selectedStatus, selectedType, exportStartDate, exportEndDate },
        withCredentials: true
      })
      dispatch(getDataSuccess(response.data))
    } catch (error) {
      dispatch(getDataFailure(error.message))
    }
  }

export const fetchTransactionWithId = id => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/transaction/${id}`, {
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

export const updateTransaction = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.patch(`${BASE_URL}/transaction/update`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Transaction successfully updated!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)
    dispatch(getDataFailure(error.response?.data?.message))
  }
}

export const createTransaction = params => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.post(`${BASE_URL}/transaction/create`, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    toast.success('Transaction successfully Created!')

    dispatch(getDataSuccess(response.data))
  } catch (error) {
    toast.error('Error! message:' + error?.response?.data?.message)
    dispatch(getDataFailure(error.response?.data?.message))
  }
}

export default transactionSlice.reducer
