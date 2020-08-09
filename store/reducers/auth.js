import { RESTORE_USER, SIGN_IN, SIGN_UP, LOGOUT } from '../actions/auth'

const initialState = {
  token: '',
  userId: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_USER:
    case SIGN_IN:
    case SIGN_UP:
      return {
        ...state,
        token: action.token,
        userId: action.userId
      }
    case LOGOUT:
      return {
        ...state,
        ...initialState
      }
    default:
      return state
  }
}
