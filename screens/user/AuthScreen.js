import React, {
  useCallback,
  useLayoutEffect,
  useReducer,
  useState
} from 'react'
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'

import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors'
import * as authActions from '../../store/actions/auth'
import { SIGN_IN, SIGN_UP } from '../../store/actions/auth'

const LOGIN_FORM_UPDATE = 'LOGIN_FORM_UPDATE'

const formReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_FORM_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      }

      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      }

      const isValidForm = Object.keys(updatedValidities).reduce(
        (valid, current) => valid && updatedValidities[current],
        true
      )

      return {
        ...state,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: isValidForm
      }
  }

  return state
}

const AuthScreen = (props) => {
  const [authMode, setAuthMode] = useState(SIGN_IN)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const changeModeBtnTitle =
    authMode === SIGN_IN ? 'Switch to Sign Up' : 'Switch to Sign In'
  const authBtnTitle = authMode === SIGN_IN ? 'Login' : 'Sign Up'

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  })

  const changeModeHandler = () => {
    setAuthMode((prevMode) => (prevMode === SIGN_IN ? SIGN_UP : SIGN_IN))
  }

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: LOGIN_FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      })
    },
    [dispatchFormState]
  )

  const dispatch = useDispatch()

  const authenticate = async () => {
    const { email, password } = formState.inputValues
    setError(null)
    setLoading(true)
    try {
      await dispatch(authActions.authenticate(email, password, authMode))
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useLayoutEffect(() => {
    if (error) {
      Alert.alert('Error occurred', error, [{ text: 'OK' }])
    }
  }, [error])

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="EMAIL"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="PASSWORD"
              keyboardType="default"
              secureTextEntry
              required
              miLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.authBtnContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={authBtnTitle}
                  color={Colors.primary}
                  disabled={!formState.formIsValid}
                  onPress={authenticate}
                />
              )}
            </View>
            <View style={styles.authBtnContainer}>
              <Button
                title={changeModeBtnTitle}
                color={Colors.accent}
                onPress={changeModeHandler}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  authBtnContainer: {
    marginTop: 10
  }
})

export default AuthScreen
