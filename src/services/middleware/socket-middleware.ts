import { Middleware, MiddlewareAPI, Dispatch, UnknownAction } from 'redux';
import { RootState } from '../store';

export type TWsActionTypes = {
  wsConnect: string;
  wsDisconnect: string;
  wsSendMessage?: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export const socketMiddleware = (
  wsActions: TWsActionTypes
): Middleware<{}, RootState, Dispatch<UnknownAction>> =>
  ((store: MiddlewareAPI<Dispatch<UnknownAction>, RootState>) => {
    let socket: WebSocket | null = null;

    return (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
      const { dispatch } = store;
      const { type, payload } = action as { type: string; payload?: unknown };
      const { wsConnect, wsDisconnect, onOpen, onClose, onError, onMessage } =
        wsActions;

      if (type === wsConnect) {
        try {
          socket = new WebSocket(payload as string);
        } catch (error: unknown) {
          dispatch({ type: onError, payload: 'WebSocket creation failed' });
          return;
        }

        socket.onopen = (event: Event) => {
          dispatch({ type: onOpen, payload: event });
        };

        socket.onclose = (event: CloseEvent) => {
          dispatch({ type: onClose, payload: event });
        };

        socket.onerror = (event: Event) => {
          dispatch({ type: onError, payload: 'WebSocket connection error' });
        };

        socket.onmessage = (event: MessageEvent) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data);
            dispatch({ type: onMessage, payload: parsedData });
          } catch (error: unknown) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      }

      if (type === wsDisconnect && socket) {
        socket.close();
        socket = null;
      }

      next(action);
    };
  }) as Middleware;
