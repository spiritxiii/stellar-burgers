import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredients } from '@selectors';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { fetchIngredients } from '@slices';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(getIngredients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Есть проблемы с запросом к API для получения данных заказа
  // WebSocket connection to '<URL>' failed: WebSocket is closed before the connection is established.
  // В коде с:
  // const wsUrl = 'wss://norma.education-services.ru/orders/all';
  //     dispatch(wsConnectionStart(wsUrl));
  // const orderData = useSelector(getOrderByNumber(number));

  // Временные данные для демонстрации
  const orderInfo = useMemo(() => {
    if (!ingredients.length || !number) return null;

    const orderNumber = parseInt(number);

    const status = orderNumber % 2 === 0 ? 'done' : 'pending';

    // Выбираем случайные ингредиенты для заказа
    const bun = ingredients.find((ing) => ing.type === 'bun');
    const mains = ingredients.filter((ing) => ing.type === 'main').slice(0, 2);
    const sauces = ingredients
      .filter((ing) => ing.type === 'sauce')
      .slice(0, 1);

    const selectedIngredients = [bun, ...mains, ...sauces].filter(
      Boolean
    ) as TIngredient[];

    const orderIngredients = [
      selectedIngredients[0]?._id,
      ...selectedIngredients.slice(1).map((ing) => ing._id),
      selectedIngredients[0]?._id
    ].filter(Boolean);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderIngredients.reduce(
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

    const bunName = bun ? bun.name.replace('булка', '').trim() : 'Космический';
    const mainNames = mains.map((main) => main.name.split(' ')[0]).join(', ');
    const burgerName = `${bunName} бургер${mains.length > 0 ? ` с ${mainNames}` : ''}`;

    return {
      _id: `order_${number}`,
      status,
      name: burgerName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: orderNumber,
      ingredients: orderIngredients,
      ingredientsInfo,
      total,
      date: new Date()
    };
  }, [ingredients, number]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
