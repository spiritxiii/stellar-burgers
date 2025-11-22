import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  const ingredients: TIngredient[] = useMemo(
    () => [
      {
        _id: '60d3b41abdacab0026a733c6',
        name: 'Флюоресцентная булка',
        type: 'bun',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
      },
      {
        _id: '60d3b41abdacab0026a733c8',
        name: 'Филе Люминесцентного тетраодонтимформа',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
      },
      {
        _id: '60d3b41abdacab0026a733cc',
        name: 'Соус с шипами Антарианского плоскоходца',
        type: 'sauce',
        proteins: 101,
        fat: 99,
        carbohydrates: 100,
        calories: 100,
        price: 88,
        image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-01-mobile.png'
      },
      {
        _id: '60d3b41abdacab0026a733cd',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
      },
      {
        _id: '60d3b41abdacab0026a733cf',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-04-mobile.png'
      },
      {
        _id: '60d3b41abdacab0026a733d4',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: 'https://code.s3.yandex.net/react/code/meat-04.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png'
      },
      {
        _id: '60d3b41abdacab0026a733d3',
        name: 'Кристаллы марсианских альфа-сахаридов',
        type: 'main',
        proteins: 234,
        fat: 432,
        carbohydrates: 111,
        calories: 189,
        price: 762,
        image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
        image_large:
          'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png'
      }
    ],
    []
  );

  const orderInfo = useMemo(() => {
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], itemId: string) => {
        const ingredient = ingredients.find((ing) => ing._id === itemId);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo.ingredientsInfo.length) {
    return null;
  }

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
