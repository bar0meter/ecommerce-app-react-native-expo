import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart'
import CartItem from '../../models/cart-item'
import { ADD_ORDER } from '../actions/orders'
import { DELETE_PRODUCT } from '../actions/products'

const initialState = {
  items: [],
  totalAmount: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product
      const prodPrice = addedProduct.price
      const prodTitle = addedProduct.title

      let updatedOrNewCartItem

      if (state.items.hasOwnProperty(addedProduct.id)) {
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        )
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice)
      }

      const newState = {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice
      }

      return newState

    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid]
      let updatedCartItems

      if (selectedCartItem.quantity === 1) {
        updatedCartItems = { ...state.items }
        delete updatedCartItems[action.pid]
      } else {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        )
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem }
      }

      const newTotalAmount = state.totalAmount - selectedCartItem.productPrice // since we are rounding off
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: newTotalAmount < 0 ? 0 : newTotalAmount
      }
    case ADD_ORDER:
      return initialState
    case DELETE_PRODUCT:
      const deletedProductId = action.pid
      const updatedItems = { ...state.items }

      if (!updatedItems.hasOwnProperty(deletedProductId)) {
        return state
      }
      const deletedProdSum = updatedItems[deletedProductId].sum
      delete updatedItems[deletedProductId]

      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - deletedProdSum
      }
  }

  return state
}
