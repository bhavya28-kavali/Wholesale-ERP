import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import socket from '../socket/socket';
import useAuth from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const NotificationContext = createContext(null);

const MAX_NOTIFICATIONS = 50;

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);

  const push = useCallback((item) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...item,
    };
    setNotifications((prev) => [entry, ...prev].slice(0, MAX_NOTIFICATIONS));
    return entry;
  }, []);

  useEffect(() => {
    if (!user?.role) return undefined;

    socket.emit('joinRole', user.role);

    const onLowStock = (data) => {
      const entry = push({
        type: 'lowStock',
        title: 'Low stock alert',
        message: `${data.product} — ${data.quantity ?? data.stock} units left`,
      });
      toast.warning(entry.message);
    };

    const onOrder = (data) => {
      const entry = push({
        type: 'order',
        title: 'New order',
        message: data.message || `Order ${data.orderNumber} placed`,
      });
      toast.success(entry.message);
    };

    const onInvoice = (data) => {
      const entry = push({
        type: 'invoice',
        title: 'Invoice generated',
        message: data.message || `Invoice ${data.invoiceNumber}`,
      });
      toast.success(entry.message);
    };

    const onStock = (data) => {
      push({
        type: 'stock',
        title: 'Stock updated',
        message: data.name ? `${data.name} inventory changed` : 'Inventory updated',
      });
    };

    socket.on('lowStockAlert', onLowStock);
    socket.on('orderCreated', onOrder);
    socket.on('invoiceCreated', onInvoice);
    socket.on('stockUpdated', onStock);

    return () => {
      socket.off('lowStockAlert', onLowStock);
      socket.off('orderCreated', onOrder);
      socket.off('invoiceCreated', onInvoice);
      socket.off('stockUpdated', onStock);
    };
  }, [user?.role, push, toast]);

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, push }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
