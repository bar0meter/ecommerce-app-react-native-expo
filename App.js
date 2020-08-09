import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import { NavigationContainer } from '@react-navigation/native'
import ReduxThunk from 'redux-thunk'

import productsReducer from './store/reducers/products'
import cartsReducer from './store/reducers/cart'
import ordersReducer from './store/reducers/orders'
import authReducer from './store/reducers/auth'
import ShopNavigator from './navigation/ShopNavigator'

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartsReducer,
  orders: ordersReducer,
  auth: authReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontsLoaded(true)
        }}
      />
    )
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <ShopNavigator />
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
