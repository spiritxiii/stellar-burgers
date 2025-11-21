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

      console.log('🔍 Middleware received action:', type);

      if (type === wsConnect) {
        console.log('🔌 WebSocket connecting to:', payload);
        socket = new WebSocket(payload);
      }

      if (socket) {
        socket.onopen = (event) => {
          console.log('✅ WebSocket connected');
          dispatch({ type: onOpen, payload: event });
        };

        socket.onclose = (event) => {
          console.log('❌ WebSocket disconnected');
          dispatch({ type: onClose, payload: event });
        };

        socket.onerror = (event) => {
          console.log('🚨 WebSocket error');
          dispatch({ type: onError, payload: 'WebSocket connection error' });
        };

        socket.onmessage = (event) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data);
            console.log('📨 WebSocket message received');
            dispatch({ type: onMessage, payload: parsedData });
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      }

      if (type === wsDisconnect && socket) {
        console.log('🔌 WebSocket disconnecting');
        socket.close();
        socket = null;
      }

      next(action);
    };
  };
