import axios from 'axios'
import {
  CATALOGUE_LIST_REQUEST,
  CATALOGUE_LIST_SUCCESS,
  CATALOGUE_LIST_FAIL,
  CATALOGUE_DETAILS_REQUEST,
  CATALOGUE_DETAILS_SUCCESS,
  CATALOGUE_DETAILS_FAIL,
  CATALOGUE_CREATE_REQUEST,
  CATALOGUE_CREATE_SUCCESS,
  CATALOGUE_CREATE_FAIL,
  CATALOGUE_CREATE_RESET,
  CATALOGUE_UPDATE_REQUEST,
  CATALOGUE_UPDATE_SUCCESS,
  CATALOGUE_UPDATE_FAIL,
  CATALOGUE_UPDATE_RESET,
  CATALOGUE_DELETE_REQUEST,
  CATALOGUE_DELETE_SUCCESS,
  CATALOGUE_DELETE_FAIL,
} from '../constants/catalogueConstants'
import { logout } from './userActions'

export const listCatalogues = () => async (dispatch) => {
  try {
    dispatch({ type: CATALOGUE_LIST_REQUEST })
    const { data } = await axios.get('/api/catalogues')
    dispatch({
      type: CATALOGUE_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CATALOGUE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listAdminCatalogues = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CATALOGUE_LIST_REQUEST })
    
    const {
      userLogin: { userInfo },
    } = getState()
    
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    
    const { data } = await axios.get('/api/catalogues/admin/all', config)
    dispatch({
      type: CATALOGUE_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CATALOGUE_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    })
  }
}

export const listCatalogueDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATALOGUE_DETAILS_REQUEST })
    const { data } = await axios.get(`/api/catalogues/${id}`)
    dispatch({
      type: CATALOGUE_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CATALOGUE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createCatalogue = (catalogue) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATALOGUE_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/catalogues', catalogue, config)

    dispatch({
      type: CATALOGUE_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: CATALOGUE_CREATE_FAIL,
      payload: message,
    })
  }
}

export const updateCatalogue = (catalogue) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATALOGUE_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `/api/catalogues/${catalogue._id}`,
      catalogue,
      config
    )

    dispatch({
      type: CATALOGUE_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: CATALOGUE_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: CATALOGUE_UPDATE_FAIL,
      payload: message,
    })
  }
}

export const deleteCatalogue = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATALOGUE_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/catalogues/${id}`, config)

    dispatch({
      type: CATALOGUE_DELETE_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: CATALOGUE_DELETE_FAIL,
      payload: message,
    })
  }
}

export const addProductToCatalogue = (catalogueId, productId) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `/api/catalogues/${catalogueId}/products/${productId}`,
      {},
      config
    )

    dispatch({
      type: CATALOGUE_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.error('Error adding product to catalogue:', error)
  }
}

export const removeProductFromCatalogue = (catalogueId, productId) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.delete(
      `/api/catalogues/${catalogueId}/products/${productId}`,
      config
    )

    dispatch({
      type: CATALOGUE_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.error('Error removing product from catalogue:', error)
  }
}
