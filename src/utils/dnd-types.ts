export const IngredientTypes = {
  BUN: 'bun',
  INGREDIENT: 'ingredient',
  CONSTRUCTOR_INGREDIENT: 'constructor_ingredient'
} as const;

export type TIngredientTypes =
  (typeof IngredientTypes)[keyof typeof IngredientTypes];
