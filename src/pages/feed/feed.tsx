import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { wsConnectionStart, wsConnectionClose } from '@slices';
import { getFeedOrders, getFeedWsConnected } from '@selectors';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const wsConnected = useSelector(getFeedWsConnected);
  const [useFallback, setUseFallback] = useState(false);

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      ingredients: [
        '60d3b41abdacab0026a733c6',
        '60d3b41abdacab0026a733c8',
        '60d3b41abdacab0026a733cc'
      ],
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: 23456
    },
    {
      _id: '2',
      ingredients: [
        '60d3b41abdacab0026a733c7',
        '60d3b41abdacab0026a733cd',
        '60d3b41abdacab0026a733cf'
      ],
      status: 'pending',
      name: 'Spicy традиционный-галактический бургер',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: 23457
    },
    {
      _id: '3',
      ingredients: [
        '60d3b41abdacab0026a733c6',
        '60d3b41abdacab0026a733d4',
        '60d3b41abdacab0026a733d3'
      ],
      status: 'done',
      name: 'Краторный метеоритный бургер',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: 23455
    }
  ];

  useEffect(() => {
    const wsUrl = 'wss://norma.education-services.ru/orders/all';
    dispatch(wsConnectionStart(wsUrl));

    const timer = setTimeout(() => {
      if (!wsConnected) {
        setUseFallback(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      dispatch(wsConnectionClose());
    };
  }, [dispatch, wsConnected]);

  const handleGetFeeds = () => {
    const wsUrl = 'wss://norma.education-services.ru/orders/all';
    dispatch(wsConnectionStart(wsUrl));
    setUseFallback(false);
  };

  const displayOrders =
    wsConnected && orders.length > 0 && !useFallback ? orders : mockOrders;

  return (
    <div>
      {useFallback && (
        <div
          style={{
            background: '#1C1C21',
            padding: '10px 20px',
            textAlign: 'center',
            color: '#8585AD',
            borderBottom: '1px solid #2F2F37'
          }}
        >
          📋 Используются демонстрационные данные
        </div>
      )}
      <FeedUI orders={displayOrders} handleGetFeeds={handleGetFeeds} />
    </div>
  );
};
