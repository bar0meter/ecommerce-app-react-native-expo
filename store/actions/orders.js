import Order from '../../models/order-data'

export const ADD_ORDER = 'ADD_ORDER'
export const SET_ORDERS = 'SET_ORDERS'

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const { userId } = getState().auth
    const response = await fetch(
      `https://rn-shopping-app-c8d75.firebaseio.com/orders/${userId}.json`
    )

    if (!response.ok) {
      throw new Error('Something went wrong')
    }

    const resData = await response.json()

    const orders =
      !!resData && Object.keys(resData).length
        ? Object.keys(resData).map((orderId) => {
            const { cartItems, totalAmount, date } = resData[orderId]
            return new Order(orderId, cartItems, totalAmount, date)
          })
        : []

    dispatch({
      type: SET_ORDERS,
      orders
    })
  }
}

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const now = new Date()
    const { token, userId } = getState().auth
    const response = await fetch(
      `https://rn-shopping-app-c8d75.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: now.toISOString()
        })
      }
    )

    if (!response.ok) {
      throw new Error('Something went wrong')
    }

    const resDat = await response.json()

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resDat.name,
        items: cartItems,
        amount: totalAmount,
        date: now
      }
    })
  }
}
