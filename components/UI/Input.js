import React, { useReducer, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'

const INPUT_CHANGE = 'INPUT_CHANGE'
const INPUT_BLUR = 'INPUT_BLUR'

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
        touched: true
      }
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      }
    default:
      return state
  }
}

const Input = (props) => {
  const { onInputChange, initialVal, initiallyValid, id } = props

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialVal ? initialVal : '',
    isValid: initiallyValid,
    touched: false
  })

  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let isValid = true
    if (props.required && text.trim().length === 0) {
      isValid = false
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false
    }
    if (props.min != null && +text < props.min) {
      isValid = false
    }
    if (props.max != null && +text > props.max) {
      isValid = false
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false
    }

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid })
  }

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR })
  }

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid)
    }
  }, [inputState, onInputChange, id])

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {inputState.touched && !inputState.isValid && (
        <Text>{props.errorText}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
    marginVertical: 5
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 5
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
})

export default Input
