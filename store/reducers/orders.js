import { ADD_ORDER, SET_ORDERS } from '../actions/orders'
import Order from '../../models/order-data'

const initialState = {
  orders: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        ...state,
        orders: action.orders
      }
    case ADD_ORDER:
      const { date, amount, items, id } = action.orderData
      const newOrder = new Order(id, items, amount, date)

      return {
        ...state,
        orders: state.orders.concat(newOrder)
      }
  }

  return state
}
