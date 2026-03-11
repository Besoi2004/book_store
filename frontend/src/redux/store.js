import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlide';
import booksApi from './features/books/booksApi';
import ordersApi from './features/orders/ordersApi';
import notificationsApi from './features/notifications/notificationsApi';
import usersApi from './features/users/usersApi';
import couponsApi from './features/coupons/couponsApi';
import contactsApi from './features/contacts/contactsApi';
import ranksApi from './features/ranks/ranksApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [ranksApi.reducerPath]: ranksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware, ordersApi.middleware, notificationsApi.middleware, usersApi.middleware, couponsApi.middleware, contactsApi.middleware, ranksApi.middleware),
})