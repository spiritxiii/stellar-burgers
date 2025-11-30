import { describe, it, expect } from '@jest/globals';
import { rootReducer } from '../store';
import { clearConstructor } from '@slices';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Булка',
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

const mockIngredient: TConstructorIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  price: 50,
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  image: '',
  image_large: '',
  image_mobile: '',
  id: '123'
};

describe('Тестируем rootReducer', () => {
  it('Должны получить начальное состояние', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      },
      order: {
        order: null,
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      feed: {
        wsConnected: false,
        orders: [],
        total: 0,
        totalToday: 0
      },
      userOrders: {
        wsConnected: false,
        orders: [],
        total: 0,
        totalToday: 0
      }
    });
  });

  it('Тестируем очистку конструктора бургера', () => {
    const stateWithItems = {
      burgerConstructor: {
        bun: mockBun,
        ingredients: [mockIngredient]
      },
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      },
      order: {
        order: null,
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      feed: {
        wsConnected: false,
        orders: [],
        total: 0,
        totalToday: 0
      },
      userOrders: {
        wsConnected: false,
        orders: [],
        total: 0,
        totalToday: 0
      }
    };

    const newState = rootReducer(stateWithItems, clearConstructor());

    expect(newState.burgerConstructor.bun).toBeNull();
    expect(newState.burgerConstructor.ingredients).toEqual([]);
  });
});
