import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

type TApiError = {
  success?: boolean;
  message?: string;
  status?: number;
  response?: {
    data?: {
      message?: string;
    };
  };
};

const getErrorMessage = (error: TApiError | string | unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    const err = error as TApiError;

    if (err.success === false && err.message) {
      return err.message;
    }
    if (err.message) {
      return err.message;
    }
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (err.status === 403) {
      return 'Доступ запрещен. Проверьте авторизацию.';
    }
    if (err.status === 401) {
      return 'Неверные учетные данные.';
    }
  }

  return 'Произошла ошибка при выполнении запроса';
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        return rejectWithValue('No access token');
      }
      const response = await getUserApi();
      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (
    data: { name?: string; email?: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Ошибка выхода';
      })

      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка обновления профиля';
      });
  }
});

export const { setAuthChecked, clearError } = userSlice.actions;
export default userSlice.reducer;
