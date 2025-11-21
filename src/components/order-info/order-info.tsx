import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector } from '../../services/store';
import { getIngredients } from '@selectors';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(getIngredients);

  // моковые данные для тестирования
  const mockOrderData = useMemo(() => {
    if (!ingredients.length) return null;

    return {
      _id: 'mock_id',
      status: 'done',
      name: 'Mock Burger',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: number ? parseInt(number) : 12345,
      ingredients: ingredients.slice(0, 5).map((ing) => ing._id) // Берем первые 5 ингредиентов
    };
  }, [ingredients, number]);

  const orderInfo = useMemo(() => {
    if (!mockOrderData || !ingredients.length) return null;

    const date = new Date(mockOrderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = mockOrderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...mockOrderData,
      ingredientsInfo,
      date,
      total
    };
  }, [mockOrderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
