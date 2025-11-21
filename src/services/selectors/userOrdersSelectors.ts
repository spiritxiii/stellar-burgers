import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const getUserOrdersState = (state: RootState) => state.userOrders;
export const getUserOrders = (state: RootState) => state.userOrders.orders;
export const getUserOrdersTotal = (state: RootState) => state.userOrders.total;
export const getUserOrdersTotalToday = (state: RootState) =>
  state.userOrders.totalToday;
export const getUserOrdersWsConnected = (state: RootState) =>
  state.userOrders.wsConnected;

export const getUserDoneOrders = createSelector([getUserOrders], (orders) =>
  orders.filter((order) => order.status === 'done')
);

export const getUserPendingOrders = createSelector([getUserOrders], (orders) =>
  orders.filter((order) => order.status === 'pending')
);
