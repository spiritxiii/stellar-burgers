import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '@slices';
import { getIngredientById, getIngredientsLoading } from '@selectors';
import { Preloader, IngredientDetailsUI } from '@ui';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const ingredientData = useSelector((state) => getIngredientById(state, id!));
  const isIngredientsLoading = useSelector(getIngredientsLoading);

  useEffect(() => {
    if (!ingredientData && !isIngredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientData, isIngredientsLoading]);

  if (isIngredientsLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
