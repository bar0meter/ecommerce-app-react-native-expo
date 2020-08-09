import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer'
import { Button, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen'
import ProductDetailScreen from '../screens/shop/ProductDetailScreen'
import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from '../screens/shop/OrdersScreen'
import UserProductScreen from '../screens/user/UserProductsScreen'
import CustomHeaderButton from '../components/UI/CustomHeaderButton'
import EditProductScreen from '../screens/user/EditProductScreen'
import Colors from '../constants/Colors'
import AuthScreen from '../screens/user/AuthScreen'
import * as authActions from '../store/actions/auth'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductOverviewNavigationOptions = (navData) => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <CustomHeaderButton
        onBtnClick={() => {
          navData.navigation.toggleDrawer()
        }}
        btnIcon={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
      />
    ),
    headerRight: () => (
      <CustomHeaderButton
        onBtnClick={() => {
          navData.navigation.navigate('Cart')
        }}
        btnIcon={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
      />
    )
  }
}

const ProductDetailNavigationOptions = (navData) => {
  const { productTitle } = navData.route.params
  return {
    headerTitle: productTitle
  }
}

const ProductsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="ProductsOverview"
        component={ProductOverviewScreen}
        options={(navData) => ProductOverviewNavigationOptions(navData)}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={(navData) => ProductDetailNavigationOptions(navData)}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerTitle: 'Your Cart'
        }}
      />
    </Stack.Navigator>
  )
}

const OrdersScreenNavigationOptions = (navData) => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: () => (
      <CustomHeaderButton
        onBtnClick={() => {
          navData.navigation.toggleDrawer()
        }}
        btnIcon={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
      />
    )
  }
}

const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={(navData) => OrdersScreenNavigationOptions(navData)}
      />
    </Stack.Navigator>
  )
}

const UserProductsScreenNavigationOptions = (navData) => {
  return {
    headerTitle: 'Your Products',
    headerLeft: () => (
      <CustomHeaderButton
        onBtnClick={() => {
          navData.navigation.toggleDrawer()
        }}
        btnIcon={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
      />
    ),
    headerRight: () => (
      <CustomHeaderButton
        onBtnClick={() => {
          navData.navigation.navigate('EditProduct')
        }}
        btnIcon={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
      />
    )
  }
}

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="UserProducts"
        component={UserProductScreen}
        options={(navData) => UserProductsScreenNavigationOptions(navData)}
      />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
    </Stack.Navigator>
  )
}

const authScreenNavigationOptions = (navData) => {
  return {
    headerTitle: 'Authenticate'
  }
}

const ShopNavigator = (props) => {
  const userToken = useSelector(({ auth }) => auth.token)
  const dispatch = useDispatch()

  useEffect(() => {
    const bootstrapAsync = async () => {
      const data = await AsyncStorage.getItem('userData')
      if (!data) {
        return
      }

      const userData = JSON.parse(data)
      const { token, userId, expiryDate } = userData
      const expirationDate = new Date(expiryDate)

      if (expirationDate <= new Date()) {
        return
      }

      dispatch(authActions.restoreUser(token, userId))
      // dispatch(authActions.reauthenticateUser(refreshToken))
    }

    bootstrapAsync()
  }, [dispatch])

  if (!userToken || userToken === '') {
    return (
      <Stack.Navigator
        screenOptions={{
          ...defaultNavigationOptions,
          ...authScreenNavigationOptions
        }}
      >
        <Stack.Screen name="Authentication" component={AuthScreen} />
      </Stack.Navigator>
    )
  }

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView
            {...props}
            style={{ flex: 1, paddingTop: 20 }}
          >
            <DrawerItemList {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout())
              }}
            />
          </DrawerContentScrollView>
        )
      }}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={25}
              color={color}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={25}
              color={color}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size={25}
              color={color}
            />
          )
        }}
      />
    </Drawer.Navigator>
  )
}

export default ShopNavigator
