import { FC, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getSafeConstructorItems,
  getConstructorPrice,
  getIsAuthenticated,
  getOrderRequest,
  getOrderModalData
} from '@selectors';
import {
  addBun,
  addIngredient,
  createOrder,
  closeOrderModal,
  clearConstructor
} from '@slices';
import { TIngredient } from '@utils-types';
import { IngredientTypes } from '../../utils/dnd-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getSafeConstructorItems);
  const price = useSelector(getConstructorPrice);
  const isAuthenticated = useSelector(getIsAuthenticated);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [, dropTarget] = useDrop({
    accept: [IngredientTypes.INGREDIENT, IngredientTypes.BUN],
    drop: (item: { ingredient: TIngredient }) => {
      if (item.ingredient.type === 'bun') {
        dispatch(addBun(item.ingredient));
      } else {
        dispatch(addIngredient(item.ingredient));
      }
    }
  });

  useEffect(() => {
    if (orderModalData && !orderRequest) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, orderRequest, dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
    // Теперь очистка конструктора идет через useEffect
  };

  return (
    <div ref={dropTarget}>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={handleCloseOrderModal}
      />
    </div>
  );
};
