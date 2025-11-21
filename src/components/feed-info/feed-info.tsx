import { FC } from 'react';
import { FeedInfoUI } from '../ui/feed-info';

export const FeedInfo: FC = () => {
  const feed = {
    orders: [],
    total: 12547,
    totalToday: 138
  };

  const readyOrders = [23456, 23455, 23450, 23449, 23448];
  const pendingOrders = [23457, 23458, 23459];

  return (
    <FeedInfoUI
      feed={feed}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
