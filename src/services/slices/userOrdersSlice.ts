import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

type TUserOrdersState = {
  wsConnected: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error?: string;
};

const initialState: TUserOrdersState = {
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    wsUserConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.error = undefined;
    },
    wsUserConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.error = action.payload;
    },
    wsUserConnectionClosed: (state) => {
      state.wsConnected = false;
      state.error = undefined;
    },
    wsUserGetMessage: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsUserConnectionStart: (state, action: PayloadAction<string>) => state,
    wsUserConnectionClose: (state) => state
  }
});

export const {
  wsUserConnectionSuccess,
  wsUserConnectionError,
  wsUserConnectionClosed,
  wsUserGetMessage,
  wsUserConnectionStart,
  wsUserConnectionClose
} = userOrdersSlice.actions;

export default userOrdersSlice.reducer;
