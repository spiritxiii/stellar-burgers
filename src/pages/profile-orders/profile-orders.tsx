import { FC, useEffect, useState } from 'react';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);

  const mockOrders: TOrder[] = [
    {
      _id: 'user1',
      ingredients: [
        '60d3b41abdacab0026a733c6',
        '60d3b41abdacab0026a733c8',
        '60d3b41abdacab0026a733cc'
      ],
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      number: 23456
    },
    {
      _id: 'user2',
      ingredients: [
        '60d3b41abdacab0026a733c7',
        '60d3b41abdacab0026a733d4',
        '60d3b41abdacab0026a733d3'
      ],
      status: 'done',
      name: 'Краторный метеоритный бургер',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      number: 23455
    },
    {
      _id: 'user3',
      ingredients: [
        '60d3b41abdacab0026a733c6',
        '60d3b41abdacab0026a733d0',
        '60d3b41abdacab0026a733d1'
      ],
      status: 'pending',
      name: 'Минеральный астероидный бургер',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      number: 23458
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  return (
    <>
      <div
        style={{
          background: '#1C1C21',
          padding: '10px 20px',
          textAlign: 'center',
          color: '#8585AD',
          borderBottom: '1px solid #2F2F37'
        }}
      />
      <ProfileOrdersUI orders={orders} />
    </>
  );
};
