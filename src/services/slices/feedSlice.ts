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
      console.log('✅ feedSlice: wsConnectionSuccess');
      state.wsConnected = true;
      state.error = undefined;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      console.log('❌ feedSlice: wsConnectionError', action.payload);
      state.wsConnected = false;
      state.error = action.payload;
    },
    wsConnectionClosed: (state) => {
      console.log('🔌 feedSlice: wsConnectionClosed');
      state.wsConnected = false;
      state.error = undefined;
    },
    wsGetMessage: (state, action: PayloadAction<TOrdersData>) => {
      console.log('📨 feedSlice: wsGetMessage', action.payload);
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsConnectionStart: (state, action: PayloadAction<string>) => {
      console.log('🚀 feedSlice: wsConnectionStart', action.payload);
      return state; // Не меняет состояние
    },
    wsConnectionClose: (state) => {
      console.log('🛑 feedSlice: wsConnectionClose');
      return state; // Не меняет состояние
    }
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
