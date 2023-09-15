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

export const fetchTransactionData = () => async dispatch => {
  dispatch(getDataStart())
  try {
    const token = window.localStorage.getItem('accessToken')

    const response = await axios.get(`${BASE_URL}/transaction`, {
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

// export const newPost = params => async dispatch => {
//   dispatch(getDataStart())
//   const token = window.localStorage.getItem('accessToken')
//   try {
//     const response = await axios.post(`${BASE_URL}/posts/create`, params, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     })
//     toast.success('Post created successfully.')
//     dispatch(getDataSuccess(response.data))
//   } catch (error) {
//     dispatch(getDataFailure(error.message))
//     toast.error('Error! message:' + error?.response?.data?.message)
//   }
// }
// export const getPostWithId = id => async dispatch => {
//   dispatch(getDataStart())
//   try {
//     const token = window.localStorage.getItem('accessToken')
//     const response = await axios.get(`${BASE_URL}/posts/${id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     })

//     dispatch(getDataSuccess(response.data))
//   } catch (error) {
//     toast.error('Error! message:' + error?.response?.data?.message)
//     dispatch(getDataFailure(error.message))
//   }
// }
// export const updatePost = params => async dispatch => {
//   dispatch(getDataStart())
//   try {
//     const token = window.localStorage.getItem('accessToken')
//     const response = await axios.patch(`${BASE_URL}/posts/update`, params, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     })
//     toast.success('Post successfully updated!')

//     dispatch(getDataSuccess(response.data))
//   } catch (error) {
//     toast.error('Error! message:' + error?.response?.data?.message)
//     dispatch(getDataFailure(error.response?.data?.message))
//   }
// }

// export const deletePost = id => async dispatch => {
//   dispatch(getDataStart())
//   try {
//     const token = window.localStorage.getItem('accessToken')
//     const response = await axios.delete(`${BASE_URL}/posts/${id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     })
//     toast.success('Post successfully deleted!')
//     dispatch(getDataSuccess(response.data))
//   } catch (error) {
//     toast.error('Error! message:' + error?.response?.data?.message)
//     dispatch(getDataFailure(error.message))
//   }
// }

export default transactionSlice.reducer
