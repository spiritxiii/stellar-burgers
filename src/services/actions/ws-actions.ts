import {
  WS_CONNECTION_START,
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSED,
  WS_GET_MESSAGE,
  WS_SEND_MESSAGE,
  WS_CONNECTION_CLOSE,
  WS_USER_CONNECTION_START,
  WS_USER_CONNECTION_SUCCESS,
  WS_USER_CONNECTION_ERROR,
  WS_USER_CONNECTION_CLOSED,
  WS_USER_GET_MESSAGE,
  WS_USER_SEND_MESSAGE,
  WS_USER_CONNECTION_CLOSE
} from '../constants/ws-constants';
import { TOrdersData } from '@utils-types';

export const wsConnectionStart = (url: string) => ({
  type: WS_CONNECTION_START,
  payload: url
});

export const wsConnectionSuccess = () => ({
  type: WS_CONNECTION_SUCCESS
});

export const wsConnectionError = (error: string) => ({
  type: WS_CONNECTION_ERROR,
  payload: error
});

export const wsConnectionClosed = () => ({
  type: WS_CONNECTION_CLOSED
});

export const wsGetMessage = (message: TOrdersData) => ({
  type: WS_GET_MESSAGE,
  payload: message
});

export const wsSendMessage = (message: any) => ({
  type: WS_SEND_MESSAGE,
  payload: message
});

export const wsConnectionClose = () => ({
  type: WS_CONNECTION_CLOSE
});

export const wsUserConnectionStart = (url: string) => ({
  type: WS_USER_CONNECTION_START,
  payload: url
});

export const wsUserConnectionSuccess = () => ({
  type: WS_USER_CONNECTION_SUCCESS
});

export const wsUserConnectionError = (error: string) => ({
  type: WS_USER_CONNECTION_ERROR,
  payload: error
});

export const wsUserConnectionClosed = () => ({
  type: WS_USER_CONNECTION_CLOSED
});

export const wsUserGetMessage = (message: TOrdersData) => ({
  type: WS_USER_GET_MESSAGE,
  payload: message
});

export const wsUserSendMessage = (message: any) => ({
  type: WS_USER_SEND_MESSAGE,
  payload: message
});

export const wsUserConnectionClose = () => ({
  type: WS_USER_CONNECTION_CLOSE
});

export type TWsActions = ReturnType<
  | typeof wsConnectionStart
  | typeof wsConnectionSuccess
  | typeof wsConnectionError
  | typeof wsConnectionClosed
  | typeof wsGetMessage
  | typeof wsSendMessage
  | typeof wsConnectionClose
>;

export type TWsUserActions = ReturnType<
  | typeof wsUserConnectionStart
  | typeof wsUserConnectionSuccess
  | typeof wsUserConnectionError
  | typeof wsUserConnectionClosed
  | typeof wsUserGetMessage
  | typeof wsUserSendMessage
  | typeof wsUserConnectionClose
>;
