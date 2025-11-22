import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const getConstructorState = (state: RootState) =>
  state.burgerConstructor;

export const getConstructorBun = createSelector(
  [getConstructorState],
  (burgerConstructor) => burgerConstructor?.bun || null
);

export const getConstructorIngredients = createSelector(
  [getConstructorState],
  (burgerConstructor) => burgerConstructor?.ingredients || []
);

export const getSafeConstructorItems = createSelector(
  [getConstructorBun, getConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);

export const getIngredientsCounters = createSelector(
  [getConstructorBun, getConstructorIngredients],
  (bun, ingredients) => {
    const counters: { [key: string]: number } = {};

    if (bun) {
      counters[bun._id] = 2;
    }

    ingredients.forEach((ingredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 0;
      }
      counters[ingredient._id]++;
    });

    return counters;
  }
);

export const getConstructorPrice = createSelector(
  [getConstructorBun, getConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total, ingredient) => total + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }
);
