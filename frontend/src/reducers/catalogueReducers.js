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

export const catalogueListReducer = (state = { catalogues: [] }, action) => {
  switch (action.type) {
    case CATALOGUE_LIST_REQUEST:
      return { loading: true, catalogues: [] }
    case CATALOGUE_LIST_SUCCESS:
      return { loading: false, catalogues: action.payload }
    case CATALOGUE_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const catalogueDetailsReducer = (state = { catalogue: {} }, action) => {
  switch (action.type) {
    case CATALOGUE_DETAILS_REQUEST:
      return { loading: true, ...state }
    case CATALOGUE_DETAILS_SUCCESS:
      return { loading: false, catalogue: action.payload }
    case CATALOGUE_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const catalogueCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CATALOGUE_CREATE_REQUEST:
      return { loading: true }
    case CATALOGUE_CREATE_SUCCESS:
      return { loading: false, success: true, catalogue: action.payload }
    case CATALOGUE_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case CATALOGUE_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const catalogueUpdateReducer = (state = { catalogue: {} }, action) => {
  switch (action.type) {
    case CATALOGUE_UPDATE_REQUEST:
      return { loading: true }
    case CATALOGUE_UPDATE_SUCCESS:
      return { loading: false, success: true, catalogue: action.payload }
    case CATALOGUE_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case CATALOGUE_UPDATE_RESET:
      return { catalogue: {} }
    default:
      return state
  }
}

export const catalogueDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case CATALOGUE_DELETE_REQUEST:
      return { loading: true }
    case CATALOGUE_DELETE_SUCCESS:
      return { loading: false, success: true }
    case CATALOGUE_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
