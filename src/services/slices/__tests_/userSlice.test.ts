import { describe, it, expect } from '@jest/globals';
import userReducer, { loginUser, clearError } from '../userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('Тестируем редьюсер для работы с пользователями', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  it('Должны пройти инициализацию', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Авторизация пользователя', () => {
    it('Должны получить статус загрузки true в состоянии loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Должны получить пользователя и статус загрузки false в состоянии loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Должны получить ошибку и статус загрузки false в состоянии loginUser.rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Ошибка входа' }
      };
      const state = userReducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка входа');
    });
  });

  describe('Очистка ошибок', () => {
    it('Ошибки должны очиститься', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error message'
      };

      const actual = userReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });
  });
});
