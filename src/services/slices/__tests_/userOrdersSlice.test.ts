import { describe, it, expect } from '@jest/globals';
import userOrdersReducer, {
  wsUserConnectionStart,
  wsUserConnectionSuccess,
  wsUserConnectionError,
  wsUserConnectionClosed,
  wsUserGetMessage,
  wsUserConnectionClose
} from '../userOrdersSlice';
import { TOrder, TOrdersData } from '@utils-types';

const mockUserOrder: TOrder = {
  _id: 'user1',
  ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c8'],
  status: 'done',
  name: 'User Burger',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 23456
};

const mockUserOrdersData: TOrdersData = {
  orders: [mockUserOrder],
  total: 50,
  totalToday: 5
};

describe('Тестируем редьюсер userOrdersSlice', () => {
  const initialState = {
    wsConnected: false,
    orders: [],
    total: 0,
    totalToday: 0
  };

  it('Должен пройти инициализацию', () => {
    expect(userOrdersReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('Тестируем подключение WebSocket для пользователя', () => {
    it('Должен установить wsConnected в true при успешном подключении', () => {
      const action = wsUserConnectionSuccess();
      const state = userOrdersReducer(initialState, action);

      expect(state.wsConnected).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('Должен установить ошибку и wsConnected в false при ошибке подключения', () => {
      const errorMessage = 'User connection failed';
      const action = wsUserConnectionError(errorMessage);
      const state = userOrdersReducer(initialState, action);

      expect(state.wsConnected).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('Должен установить wsConnected в false при закрытии соединения', () => {
      const stateWithConnection = {
        ...initialState,
        wsConnected: true,
        orders: [mockUserOrder],
        total: 25,
        totalToday: 3
      };

      const action = wsUserConnectionClosed();
      const state = userOrdersReducer(stateWithConnection, action);

      expect(state.wsConnected).toBe(false);
      expect(state.error).toBeUndefined();
      // Данные должны сохраниться после закрытия соединения
      expect(state.orders).toEqual([mockUserOrder]);
      expect(state.total).toBe(25);
      expect(state.totalToday).toBe(3);
    });
  });

  describe('Тестируем получение сообщений для пользователя', () => {
    it('Должен обновить данные заказов пользователя при получении сообщения', () => {
      const action = wsUserGetMessage(mockUserOrdersData);
      const state = userOrdersReducer(initialState, action);

      expect(state.orders).toEqual(mockUserOrdersData.orders);
      expect(state.total).toBe(mockUserOrdersData.total);
      expect(state.totalToday).toBe(mockUserOrdersData.totalToday);
    });

    it('Должен заменить существующие данные пользователя при получении нового сообщения', () => {
      const existingState = {
        wsConnected: true,
        orders: [mockUserOrder],
        total: 30,
        totalToday: 2
      };

      const newUserOrdersData: TOrdersData = {
        orders: [
          {
            ...mockUserOrder,
            _id: 'user2',
            number: 34567,
            name: 'New User Burger',
            status: 'pending'
          }
        ],
        total: 60,
        totalToday: 8
      };

      const action = wsUserGetMessage(newUserOrdersData);
      const state = userOrdersReducer(existingState, action);

      expect(state.orders).toEqual(newUserOrdersData.orders);
      expect(state.total).toBe(newUserOrdersData.total);
      expect(state.totalToday).toBe(newUserOrdersData.totalToday);
      expect(state.wsConnected).toBe(true);
    });

    it('Должен корректно обрабатывать пустой список заказов', () => {
      const emptyOrdersData: TOrdersData = {
        orders: [],
        total: 0,
        totalToday: 0
      };

      const action = wsUserGetMessage(emptyOrdersData);
      const state = userOrdersReducer(initialState, action);

      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  describe('Тестируем действия инициализации для пользователя', () => {
    it('Должен обработать wsUserConnectionStart без изменения состояния', () => {
      const action = wsUserConnectionStart('wss://user-orders-url.com');
      const state = userOrdersReducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it('Должен обработать wsUserConnectionClose без изменения состояния', () => {
      const action = wsUserConnectionClose();
      const state = userOrdersReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('Тестируем обработку неизвестных экшенов', () => {
    it('Должен вернуть исходное состояние для неизвестного экшена', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const state = userOrdersReducer(initialState, unknownAction);

      expect(state).toEqual(initialState);
    });

    it('Должен игнорировать экшены от других слайсов', () => {
      const feedAction = {
        type: 'feed/wsGetMessage',
        payload: mockUserOrdersData
      };
      const state = userOrdersReducer(initialState, feedAction);

      expect(state).toEqual(initialState);
    });
  });
});
