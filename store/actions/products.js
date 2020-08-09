import Product from '../../models/products'

export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const ADD_PRODUCT = 'APP_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const SET_PRODUCTS = 'SET_PRODUCTS'

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const response = await fetch(
      `https://rn-shopping-app-c8d75.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Something went wrong')
    }

    dispatch({ type: DELETE_PRODUCT, pid: productId })
  }
}

export const addProduct = (title, imageUrl, price, description) => {
  return async (dispatch, getState) => {
    const { token, userId: ownerId } = getState().auth
    const response = await fetch(
      `https://rn-shopping-app-c8d75.firebaseio.com/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId
        })
      }
    )

    const resData = await response.json()

    dispatch({
      type: ADD_PRODUCT,
      productData: {
        id: resData.name,
        title,
        imageUrl,
        price,
        description,
        ownerId
      }
    })
  }
}

export const updateProduct = (id, title, imageUrl, price, description) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const response = await fetch(
      `https://rn-shopping-app-c8d75.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    )

    if (!response.ok) {
      throw new Error('Something went wrong')
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: { title, imageUrl, price, description }
    })
  }
}

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const { userId } = getState().auth
    try {
      const response = await fetch(
        'https://rn-shopping-app-c8d75.firebaseio.com/products.json'
      )
      if (!response.ok) {
        throw new Error('Something went wrong !!!')
      }

      const resData = await response.json()

      const products =
        !!resData && Object.keys(resData).length
          ? Object.keys(resData).map((prodId) => {
              const { title, description, price, imageUrl, ownerId } = resData[
                prodId
              ]
              return new Product(
                prodId,
                ownerId,
                title,
                imageUrl,
                description,
                price
              )
            })
          : []

      dispatch({
        type: SET_PRODUCTS,
        products: products,
        userProducts: products.filter((prod) => prod.ownerId === userId)
      })
    } catch (err) {
      throw err
    }
  }
}
