import { FC } from 'react';
import { useSelector } from '../../services/store';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getDoneOrders,
  getPendingOrders
} from '@selectors';
import { FeedInfoUI } from '../ui/feed-info';

export const FeedInfo: FC = () => {
  const orders = useSelector(getFeedOrders);
  const total = useSelector(getFeedTotal);
  const totalToday = useSelector(getFeedTotalToday);
  const doneOrders = useSelector(getDoneOrders);
  const pendingOrders = useSelector(getPendingOrders);

  const readyOrders = doneOrders.map((order) => order.number);
  const pendingOrdersNumbers = pendingOrders.map((order) => order.number);

  const feed = {
    orders,
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      feed={feed}
      readyOrders={readyOrders}
      pendingOrders={pendingOrdersNumbers}
    />
  );
};
