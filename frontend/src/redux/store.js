import { configureStore } from '@reduxjs/toolkit'
import cartReducer from "../redux/features/cart/CartSlide.js"
import booksApi from '../redux/features/books/booksApi.js';
import ordersApi from '../redux/features/orders/ordersApi.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware, ordersApi.middleware),
})