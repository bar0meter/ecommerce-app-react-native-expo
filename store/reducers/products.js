import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT
} from '../actions/products'
import Product from '../../models/products'

const initialState = {
  availableProducts: [],
  userProducts: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        availableProducts: action.products,
        userProducts: action.userProducts
      }
    case ADD_PRODUCT:
      const {
        title,
        imageUrl,
        price,
        description,
        ownerId
      } = action.productData
      const product = new Product(
        action.productData.id,
        ownerId,
        title,
        imageUrl,
        description,
        price
      )
      return {
        ...state,
        availableProducts: state.availableProducts.concat(product),
        userProducts: state.userProducts.concat(product)
      }

    case UPDATE_PRODUCT:
      const {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDescription
      } = action.productData

      const index = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      )

      const updatedProduct = new Product(
        action.pid,
        state.userProducts[index].ownerId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        state.userProducts[index].price
      )

      const updatedUserProducts = [...state.userProducts]
      updatedUserProducts[index] = updatedProduct

      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      )
      const updatedAvailableProducts = [...state.availableProducts]
      updatedAvailableProducts[availableProductIndex] = updatedProduct

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      }

    case DELETE_PRODUCT:
      const deletedProductId = action.pid
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          (prod) => prod.id !== deletedProductId
        ),
        userProducts: state.userProducts.filter(
          (prod) => prod.id !== deletedProductId
        )
      }
  }
  return state
}
