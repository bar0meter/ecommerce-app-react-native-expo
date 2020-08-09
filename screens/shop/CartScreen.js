import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../constants/Colors'
import CartItem from '../../components/shop/CartItem'
import * as cartActions from '../../store/actions/cart'
import * as orderActions from '../../store/actions/orders'
import Card from '../../components/UI/Card'

const CartScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const cartTotalAmount = useSelector(({ cart }) => cart.totalAmount)
  const cartItems = useSelector(({ cart }) => {
    const transformedCartItems = []
    for (const key in cart.items) {
      if (cart.items.hasOwnProperty(key)) {
        const { productTitle, productPrice, quantity, sum } = cart.items[key]
        transformedCartItems.push({
          productId: key,
          productTitle,
          productPrice,
          quantity,
          sum
        })
      }
    }

    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    )
  })

  const placeOrderHandler = async () => {
    try {
      setError(null)
      setLoading(true)
      await dispatch(orderActions.addOrder(cartItems, cartTotalAmount))
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const dispatch = useDispatch()

  if (error) {
    Alert.alert('Error', error, [{ text: 'OK' }])
  }

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total :{' '}
          <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="small" />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={placeOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            price={itemData.item.productPrice}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId))
            }}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
})

export default CartScreen
