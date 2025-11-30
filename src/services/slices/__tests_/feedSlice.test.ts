import { describe, it, expect } from '@jest/globals';

import feedReducer, {
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage,
  wsConnectionStart,
  wsConnectionClose
} from '../feedSlice';
import { TOrder, TOrdersData } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c8'],
  status: 'done',
  name: 'Test Burger',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345
};

const mockOrdersData: TOrdersData = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('Тестируем редьюсер для ленты заказов', () => {
  const initialState = {
    wsConnected: false,
    orders: [],
    total: 0,
    totalToday: 0
  };

  it('Должны пройти инициализацию', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Тестируем подключение WebSocket', () => {
    it('Должен установить wsConnected в true при успешном подключении', () => {
      const action = wsConnectionSuccess();
      const state = feedReducer(initialState, action);

      expect(state.wsConnected).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('Должен установить ошибку и wsConnected в false при ошибке подключения', () => {
      const errorMessage = 'Ошибка установки ws соединения';
      const action = wsConnectionError(errorMessage);
      const state = feedReducer(initialState, action);

      expect(state.wsConnected).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('Должен установить wsConnected в false при закрытии соединения', () => {
      const stateWithConnection = {
        ...initialState,
        wsConnected: true,
        orders: [mockOrder],
        total: 50,
        totalToday: 5
      };

      const action = wsConnectionClosed();
      const state = feedReducer(stateWithConnection, action);

      expect(state.wsConnected).toBe(false);
      expect(state.error).toBeUndefined();

      expect(state.orders).toEqual([mockOrder]);
      expect(state.total).toBe(50);
      expect(state.totalToday).toBe(5);
    });
  });

  describe('Тестируем получение сообщений', () => {
    it('Должен обновить данные заказов при получении сообщения', () => {
      const action = wsGetMessage(mockOrdersData);
      const state = feedReducer(initialState, action);

      expect(state.orders).toEqual(mockOrdersData.orders);
      expect(state.total).toBe(mockOrdersData.total);
      expect(state.totalToday).toBe(mockOrdersData.totalToday);
    });

    it('Должен заменить существующие данные при получении нового сообщения', () => {
      const existingState = {
        wsConnected: true,
        orders: [mockOrder],
        total: 50,
        totalToday: 5
      };

      const newOrdersData: TOrdersData = {
        orders: [
          {
            ...mockOrder,
            _id: '2',
            number: 54321,
            name: 'New Burger'
          }
        ],
        total: 150,
        totalToday: 15
      };

      const action = wsGetMessage(newOrdersData);
      const state = feedReducer(existingState, action);

      expect(state.orders).toEqual(newOrdersData.orders);
      expect(state.total).toBe(newOrdersData.total);
      expect(state.totalToday).toBe(newOrdersData.totalToday);
      expect(state.wsConnected).toBe(true);
    });
  });

  describe('Тестируем действия инициализации', () => {
    it('Должен обработать wsConnectionStart без изменения состояния', () => {
      const action = wsConnectionStart('wss://test-url.com');
      const state = feedReducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it('Должен обработать wsConnectionClose без изменения состояния', () => {
      const action = wsConnectionClose();
      const state = feedReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });
});
