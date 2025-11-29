import { describe, it, expect } from '@jest/globals';
import orderReducer, {
  createOrder,
  clearOrder,
  closeOrderModal
} from '../orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  number: 12345,
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  ingredients: ['1', '2']
};

describe('Тестируем редьюсер для работы с заказом', () => {
  const initialState = {
    order: null,
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  it('Должен пройти инициализацию', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Тестриуем создание заказа', () => {
    it('should set orderRequest true on createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Должны получить заказа в состоянии createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBeNull();
    });

    it('Должны получить ошибку в состоянии createOrder.rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: 'Order creation failed'
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBe('Order creation failed');
    });
  });

  describe('Очистка заказа', () => {
    it('Заказа должен очиститься', () => {
      const stateWithOrder = {
        order: mockOrder,
        orderRequest: false,
        orderModalData: mockOrder,
        error: null
      };

      const actual = orderReducer(stateWithOrder, clearOrder());

      expect(actual.order).toBeNull();
      expect(actual.orderModalData).toBeNull();
      expect(actual.error).toBeNull();
    });
  });

  describe('Закрытие модального окна', () => {
    it('Модальное окно должно очиститься', () => {
      const stateWithOrder = {
        order: mockOrder,
        orderRequest: false,
        orderModalData: mockOrder,
        error: null
      };

      const actual = orderReducer(stateWithOrder, closeOrderModal());

      expect(actual.orderModalData).toBeNull();
      expect(actual.order).toEqual(mockOrder);
      expect(actual.error).toBeNull();
    });
  });
});
