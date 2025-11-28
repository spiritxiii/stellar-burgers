import React, { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#00CCCC';
      case 'pending':
        return '#00CCCC';
      default:
        return '#F2F2F3';
    }
  };

  return (
    <div className={styles.wrap}>
      <span className={`text text_type_digits-default mb-10 ${styles.number}`}>
        #{String(orderInfo.number).padStart(6, '0')}
      </span>

      <h3 className={`text text_type_main-medium mb-3 ${styles.header}`}>
        {orderInfo.name}
      </h3>

      <p
        className={`text text_type_main-default mt-2 mb-6 ${styles.status}`}
        style={{ color: getStatusColor(orderInfo.status) }}
      >
        {getStatusText(orderInfo.status)}
      </p>

      <p className={`text text_type_main-medium mb-6`}>Состав:</p>

      <ul className={`${styles.list} mb-8`}>
        {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
          <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
            <div className={styles.img_wrap}>
              <div className={styles.border}>
                <img
                  className={styles.img}
                  src={item.image_mobile}
                  alt={item.name}
                />
              </div>
            </div>
            <span className='text text_type_main-default pl-4'>
              {item.name}
            </span>
            <span
              className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
            >
              {item.count} x {item.price}
            </span>
            <CurrencyIcon type={'primary'} />
          </li>
        ))}
      </ul>

      <div className={styles.bottom}>
        <p className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={orderInfo.date} />
        </p>
        <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
          {orderInfo.total}
        </span>
        <CurrencyIcon type={'primary'} />
      </div>
    </div>
  );
});
