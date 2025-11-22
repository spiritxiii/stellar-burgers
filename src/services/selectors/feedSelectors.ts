import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const getFeedState = (state: RootState) => state.feed;
export const getFeedOrders = (state: RootState) => state.feed.orders;
export const getFeedTotal = (state: RootState) => state.feed.total;
export const getFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const getFeedWsConnected = (state: RootState) => state.feed.wsConnected;

export const getDoneOrders = createSelector([getFeedOrders], (orders) =>
  orders.filter((order) => order.status === 'done').slice(0, 20)
);

export const getPendingOrders = createSelector([getFeedOrders], (orders) =>
  orders.filter((order) => order.status === 'pending').slice(0, 20)
);
