import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  wsConnected: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error?: string;
};

const initialState: TFeedState = {
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.error = undefined;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.error = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
      state.error = undefined;
    },
    wsGetMessage: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsConnectionStart: (state, action: PayloadAction<string>) => state,
    wsConnectionClose: (state) => state
  }
});

export const {
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage,
  wsConnectionStart,
  wsConnectionClose
} = feedSlice.actions;

export default feedSlice.reducer;
