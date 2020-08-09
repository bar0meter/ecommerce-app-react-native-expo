import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Button,
  Text
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Input from '../../components/UI/Input'
import CustomHeaderButton from '../../components/UI/CustomHeaderButton'
import * as productActions from '../../store/actions/products'
import Colors from '../../constants/Colors'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
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

const EditProductScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const prodId =
    !!props.route.params && props.route.params.hasOwnProperty('productId')
      ? props.route.params.productId
      : null
  const editedProd = useSelector(({ products }) =>
    products.userProducts.find((prod) => prod.id === prodId)
  )

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: !!editedProd ? editedProd.title : '',
      imageUrl: !!editedProd ? editedProd.imageUrl : '',
      price: !!editedProd ? editedProd.price + '' : '',
      description: !!editedProd ? editedProd.description : ''
    },
    inputValidities: {
      title: !!editedProd,
      imageUrl: !!editedProd,
      price: !!editedProd,
      description: !!editedProd
    },
    formIsValid: !!editedProd
  })

  const dispatch = useDispatch()

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log(`${inputIdentifier} ${inputValue} ${inputValidity}`)
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      })
    },
    [dispatchFormState]
  )

  const submitHandler = useCallback(async () => {
    console.log(JSON.stringify(formState))
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input !!!', 'Please check the errors in the form', [
        { text: 'OK' }
      ])
      return
    }

    setError(null)
    setLoading(true)
    try {
      if (!!editedProd) {
        await dispatch(
          productActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            +formState.inputValues.price,
            formState.inputValues.description
          )
        )
      } else {
        await dispatch(
          productActions.addProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            +formState.inputValues.price,
            formState.inputValues.description
          )
        )
      }
      props.navigation.goBack()
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, [dispatch, prodId, formState])

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: !!editedProd ? 'Edit Product' : 'Add Product',
      headerRight: () => (
        <CustomHeaderButton
          btnIcon={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
          onBtnClick={submitHandler}
        />
      )
    })
  }, [props.navigation, dispatch, prodId, formState])

  React.useLayoutEffect(() => {
    if (error) {
      Alert.alert('An error occurred !!', error, [{ text: 'OK' }])
    }
  })

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          label="TITLE"
          errorText="Please enter a valid title"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          required
          id="title"
          initialVal={!!editedProd ? editedProd.title : ''}
          initiallyValid={!!editedProd}
          onInputChange={inputChangeHandler}
        />
        <Input
          label="IMAGE URL"
          errorText="Please enter a valid image url"
          keyboardType="default"
          returnKeyType="next"
          required
          id="imageUrl"
          initialVal={!!editedProd ? editedProd.imageUrl : ''}
          initiallyValid={!!editedProd}
          onInputChange={inputChangeHandler}
        />
        {!editedProd && (
          <Input
            label="PRICE"
            errorText="Please enter a valid price"
            keyboardType="decimal-pad"
            returnKeyType="next"
            required
            id="price"
            initialVal={!!editedProd ? editedProd.price.toString() : ''}
            initiallyValid={!!editedProd}
            onInputChange={inputChangeHandler}
            min={0.1}
          />
        )}
        <Input
          label="DESCRIPTION"
          errorText="Please enter a valid description"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          id="description"
          initialVal={!!editedProd ? editedProd.description : ''}
          initiallyValid={!!editedProd}
          onInputChange={inputChangeHandler}
          minLength={5}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default EditProductScreen
