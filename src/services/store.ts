import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  ingredientsReducer,
  constructorReducer,
  userReducer,
  orderReducer,
  feedReducer,
  userOrdersReducer
} from '@slices';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { socketMiddleware } from './middleware/socket-middleware';

const wsMiddleware = socketMiddleware({
  wsConnect: 'feed/wsConnectionStart',
  wsDisconnect: 'feed/wsConnectionClose',
  onOpen: 'feed/wsConnectionSuccess',
  onClose: 'feed/wsConnectionClosed',
  onError: 'feed/wsConnectionError',
  onMessage: 'feed/wsGetMessage'
});

const wsUserMiddleware = socketMiddleware({
  wsConnect: 'userOrders/wsUserConnectionStart',
  wsDisconnect: 'userOrders/wsUserConnectionClose',
  onOpen: 'userOrders/wsUserConnectionSuccess',
  onClose: 'userOrders/wsUserConnectionClosed',
  onError: 'userOrders/wsUserConnectionError',
  onMessage: 'userOrders/wsUserGetMessage'
});

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(wsMiddleware, wsUserMiddleware)
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
