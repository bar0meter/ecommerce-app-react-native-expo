import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'

import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import * as productActions from '../../store/actions/products'
import Colors from '../../constants/Colors'

const ProductOverviewScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState()

  const availableProducts = useSelector(
    ({ products }) => products.availableProducts
  )
  const dispatch = useDispatch()

  const loadProducts = useCallback(async () => {
    console.log('LOAD PRODUCTS')
    setError(null)
    setRefreshing(true)
    try {
      await dispatch(productActions.fetchProducts())
    } catch (err) {
      setError(err.message)
    }
    setRefreshing(false)
  }, [dispatch, setLoading, setError])

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      props.navigation.addListener('focus', () => {
        loadProducts().then(() => setLoading(false))
      })
    }, [loadProducts])
  )

  const selectItemsHandler = ({ id, title }) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    })
  }

  const addToCartHandler = (item) => {
    dispatch(cartActions.addToCart(item))
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error occurred while retrieving data !!!
        </Text>
        <Button
          title="Try again"
          color={Colors.primary}
          onPress={() => loadProducts()}
        />
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (!loading && availableProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found maybe start adding some !!!</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={availableProducts}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={loadProducts}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => selectItemsHandler(itemData.item)}
        >
          <Button
            title="View Details"
            onPress={() => selectItemsHandler(itemData.item)}
            color={Colors.primary}
          />
          <Button
            title="Add to Cart"
            onPress={() => addToCartHandler(itemData.item)}
            color={Colors.primary}
          />
        </ProductItem>
      )}
    />
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    marginVertical: 10
  }
})

export default ProductOverviewScreen
