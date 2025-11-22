import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const getIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;

export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const getBuns = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'bun')
);

export const getMains = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'main')
);

export const getSauce = createSelector([getIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'sauce')
);

export const getIngredientById = createSelector(
  [getIngredients, (state: RootState, id: string) => id],
  (ingredients, id) => ingredients.find((item) => item._id === id)
);
