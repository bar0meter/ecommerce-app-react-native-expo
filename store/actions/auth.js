import AsyncStorage from '@react-native-community/async-storage'

export const SIGN_IN = 'SIGN_IN'
export const SIGN_UP = 'SIGN_UP'
export const RESTORE_USER = 'RESTORE_USER'
export const LOGOUT = 'LOGOUT'

const API_KEY = 'AIzaSyBJ1qLP8FFViClAocWmmvyX6VlsUDOdZQs'

export const restoreUser = (token, userId) => {
  return { type: RESTORE_USER, token, userId }
}

export const authenticate = (email, password, type) => {
  return async (dispatch) => {
    console.log(type)
    const method = type === SIGN_IN ? 'signInWithPassword' : 'signUp'
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:${method}?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    )

    if (!response.ok) {
      const errorResData = await response.json()
      const { message: errorMessage } = errorResData.error
      let message = 'Something went wrong !!!'
      if (errorMessage === 'EMAIL_NOT_FOUND') {
        message = 'Email not found'
      } else if (errorMessage === 'INVALID_PASSWORD') {
        message = 'Invalid password'
      } else if (errorMessage === 'EMAIL_EXISTS') {
        message = 'Email already exists'
      }
      throw new Error(message)
    }

    const resData = await response.json()
    const {
      idToken: token,
      email: userEmail,
      refreshToken,
      expiresIn,
      localId: userId
    } = resData

    dispatch({
      type,
      token,
      userId
    })

    const expirationDate = new Date(
      new Date().getTime() + parseInt(expiresIn, 10) * 1000
    )
    saveDataToStorage(token, userId, expirationDate.toISOString())
  }
}

export const logout = () => {
  return async (dispatch) => {
    await AsyncStorage.removeItem('userData')
    dispatch({ type: LOGOUT })
  }
}

const saveDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({ token, userId, expiryDate })
  )
}
