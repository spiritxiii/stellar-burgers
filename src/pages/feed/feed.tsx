import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { wsConnectionStart, wsConnectionClose } from '@slices';
import { getFeedOrders, getFeedWsConnected } from '@selectors';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const wsConnected = useSelector(getFeedWsConnected);

  useEffect(() => {
    console.log('🚀 Feed mounted, dispatching wsConnectionStart');
    dispatch(wsConnectionStart('wss://norma.nomoreparties.space/orders/all'));

    return () => {
      console.log('🧹 Feed unmounted, dispatching wsConnectionClose');
      dispatch(wsConnectionClose());
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    console.log('🔄 Manual refresh requested');
    if (!wsConnected) {
      dispatch(wsConnectionStart('wss://norma.nomoreparties.space/orders/all'));
    }
  };

  console.log('📊 Feed state:', { wsConnected, ordersCount: orders.length });

  if (!wsConnected) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
