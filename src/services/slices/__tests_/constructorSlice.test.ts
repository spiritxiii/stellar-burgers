import { describe, it, expect } from '@jest/globals';
import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Test Bun',
  type: 'bun',
  price: 100,
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'Test Ingredient',
  type: 'main',
  price: 50,
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('Тестируем редьюсер burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('Должны успешно пройти инициализацию', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('Добавляем булку', () => {
    it('Булка должна добавиться в конструктор', () => {
      const actual = constructorReducer(initialState, addBun(mockBun));
      expect(actual.bun).toEqual(mockBun);
    });

    it('Должны заменить булку на другую', () => {
      const stateWithBun = constructorReducer(initialState, addBun(mockBun));
      const newBun: TIngredient = { ...mockBun, _id: '3', name: 'New Bun' };
      const actual = constructorReducer(stateWithBun, addBun(newBun));

      expect(actual.bun).toEqual(newBun);
      expect(actual.bun?._id).toBe('3');
    });
  });

  describe('Добавляем ингридиент', () => {
    it('Ингридиент должен добавиться в конструктор', () => {
      const actual = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(actual.ingredients).toHaveLength(1);
      expect(actual.ingredients[0]).toMatchObject(mockIngredient);
      expect(actual.ingredients[0]).toHaveProperty('id');
    });

    it('Должен сгенерироваться ункальный id для каждого ингридиента', () => {
      const firstState = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const secondState = constructorReducer(
        firstState,
        addIngredient(mockIngredient)
      );

      expect(firstState.ingredients[0].id).not.toBe(
        secondState.ingredients[1].id
      );
    });
  });

  describe('Удаляем ингридиент', () => {
    it('Ингридиент должен удалиться', () => {
      const stateWithIngredient = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const ingredientId = stateWithIngredient.ingredients[0].id;

      const actual = constructorReducer(
        stateWithIngredient,
        removeIngredient(ingredientId)
      );
      expect(actual.ingredients).toHaveLength(0);
    });

    it('Ничего не должно было удалиться, если нет такого id', () => {
      const stateWithIngredient = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const originalIngredients = [...stateWithIngredient.ingredients];

      const actual = constructorReducer(
        stateWithIngredient,
        removeIngredient('non-existent-id')
      );
      expect(actual.ingredients).toEqual(originalIngredients);
    });
  });

  describe('Перенесем ингридиент', () => {
    it('Ингридиент должен был переместиться', () => {
      const ingredient1: TIngredient = { ...mockIngredient, _id: '1' };
      const ingredient2: TIngredient = { ...mockIngredient, _id: '2' };
      const ingredient3: TIngredient = { ...mockIngredient, _id: '3' };

      let state = constructorReducer(initialState, addIngredient(ingredient1));
      state = constructorReducer(state, addIngredient(ingredient2));
      state = constructorReducer(state, addIngredient(ingredient3));

      const actual = constructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(actual.ingredients[0]._id).toBe('2');
      expect(actual.ingredients[1]._id).toBe('3');
      expect(actual.ingredients[2]._id).toBe('1');
    });

    it('Не должен измениться порядок, если индексы совпадают', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: '2' })
      );

      const originalIngredients = [...state.ingredients];
      const actual = constructorReducer(
        state,
        moveIngredient({ fromIndex: 1, toIndex: 1 })
      );

      expect(actual.ingredients).toEqual(originalIngredients);
    });
  });

  describe('Очистка конструктора', () => {
    it('В конструкторе не должны остаться ингридиенты и булка', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));
      state = constructorReducer(state, addIngredient(mockIngredient));

      const actual = constructorReducer(state, clearConstructor());

      expect(actual.bun).toBeNull();
      expect(actual.ingredients).toHaveLength(0);
    });
  });
});
