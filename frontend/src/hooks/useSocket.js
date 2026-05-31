import { useEffect, useRef } from 'react';
import socket from '../socket/client';
import useAuth from './useAuth';

export const useSocket = (handlers = {}) => {
  const { user } = useAuth();
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!user?.role) return undefined;

    socket.emit('joinRole', user.role);

    const listeners = Object.keys(handlersRef.current).map((event) => {
      const listener = (payload) => handlersRef.current[event]?.(payload);
      socket.on(event, listener);
      return [event, listener];
    });

    return () => {
      listeners.forEach(([event, listener]) => socket.off(event, listener));
    };
  }, [user?.role]);

  return socket;
};

export default useSocket;
