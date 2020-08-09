import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'

import OrderItem from '../../components/shop/OrderItem'
import * as orderActions from '../../store/actions/orders'
import Colors from '../../constants/Colors'

const OrdersScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const userOrders = useSelector(({ orders }) => orders.orders)

  const dispatch = useDispatch()

  const loadOrders = useCallback(async () => {
    console.log('LOAD ORDERS')
    setLoading(true)
    await dispatch(orderActions.fetchOrders())
    setLoading(false)
  }, [dispatch, setLoading])

  useFocusEffect(
    useCallback(() => {
      props.navigation.addListener('focus', loadOrders)
    }, [loadOrders])
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (userOrders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Orders found, maybe start ordering some !!!</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={userOrders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default OrdersScreen
