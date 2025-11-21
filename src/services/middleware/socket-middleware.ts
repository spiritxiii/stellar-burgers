import { Middleware } from 'redux';

export type TWsActionTypes = {
  wsConnect: string;
  wsDisconnect: string;
  wsSendMessage?: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export const socketMiddleware =
  (wsActions: TWsActionTypes): Middleware =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const { type, payload } = action as any;
      const { wsConnect, wsDisconnect, onOpen, onClose, onError, onMessage } =
        wsActions;

      if (type === wsConnect) {
        try {
          socket = new WebSocket(payload);
        } catch (error) {
          dispatch({ type: onError, payload: 'WebSocket creation failed' });
          return;
        }

        socket.onopen = (event) => {
          dispatch({ type: onOpen, payload: event });
        };

        socket.onclose = (event) => {
          dispatch({ type: onClose, payload: event });
        };

        socket.onerror = (event) => {
          dispatch({ type: onError, payload: 'WebSocket connection error' });
        };

        socket.onmessage = (event) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data);
            dispatch({ type: onMessage, payload: parsedData });
          } catch (error) {
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
  };
