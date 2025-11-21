import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { wsUserConnectionStart, wsUserConnectionClose } from '@slices';
import { getCookie } from '../../utils/cookie';
import { getFeedOrders, getFeedWsConnected } from '@selectors';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const wsConnected = useSelector(getFeedWsConnected);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      const token = accessToken.replace('Bearer ', '');
      dispatch(
        wsUserConnectionStart(
          `wss://norma.nomoreparties.space/orders?token=${token}`
        )
      );
    }

    return () => {
      dispatch(wsUserConnectionClose());
    };
  }, [dispatch]);

  if (!wsConnected || orders.length === 0) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
