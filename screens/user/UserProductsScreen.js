import React from 'react'
import { Alert, Button, FlatList, Text, View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import ProductItem from '../../components/shop/ProductItem'
import Colors from '../../constants/Colors'
import * as productActions from '../../store/actions/products'

const UserProductScreen = (props) => {
  const userProducts = useSelector(({ products }) => products.userProducts)
  const dispatch = useDispatch()

  const deleteHandler = (id) => {
    Alert.alert('Are you sure ?', 'Do you really want to delete this item ?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(productActions.deleteProduct(id))
        }
      }
    ])
  }

  const editProductHandler = (productId) => {
    props.navigation.navigate('EditProduct', {
      productId
    })
  }

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products found, maybe start creating some !!!</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => editProductHandler(itemData.item.id)}
        >
          <Button
            title="Edit"
            onPress={() => editProductHandler(itemData.item.id)}
            color={Colors.primary}
          />
          <Button
            title="Delete"
            onPress={() => deleteHandler(itemData.item.id)}
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
  }
})

export default UserProductScreen
