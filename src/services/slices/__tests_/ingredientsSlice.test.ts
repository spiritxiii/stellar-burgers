import { describe, it, expect } from '@jest/globals';
import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Test Ingredient 1',
    type: 'bun',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: '2',
    name: 'Test Ingredient 2',
    type: 'main',
    price: 50,
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('Тестируем редьдюсер для ингридиентов', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('Должны пройти инициализацию', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('Тестируем fetchIngredients', () => {
    it('Должны получить true на состоянии fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        loading: true,
        error: null
      });
    });

    it('Должны получить ингридиенты и false в загрузке в состоянии fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('Должны получить ошибку и false в загрузке в состоянии fetchIngredients.rejected', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка при попытке получить список ингридиентов' }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        loading: false,
        error: 'Ошибка при попытке получить список ингридиентов'
      });
    });

    it('Должны получить ошибку в payload', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: 'Ошибка при попытке получить список ингридиентов'
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.error).toBe(
        'Ошибка при попытке получить список ингридиентов'
      );
    });
  });
});
