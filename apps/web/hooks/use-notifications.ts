'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface OrderNotification {
  id: string;
  type: 'new_order' | 'order_update' | 'order_canceled';
  orderId: string;
  customerName: string;
  total: number;
  itemsCount: number;
  status: string;
  createdAt: string;
}

export interface GenericNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  createdAt: string;
}

interface UseNotificationsOptions {
  userId?: string;
  onNewOrder?: (notification: OrderNotification) => void;
  onOrderUpdate?: (notification: OrderNotification) => void;
  onNotification?: (notification: GenericNotification) => void;
  playSound?: boolean;
}

const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { userId, onNewOrder, onOrderUpdate, onNotification, playSound = true } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<(OrderNotification | GenericNotification)[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback(() => {
    if (!playSound) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
      audioRef.current.volume = 0.5;
    }
    
    audioRef.current.play().catch(() => {
      // Audio play failed (user hasn't interacted with page yet)
    });
  }, [playSound]);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    socketRef.current = io(`${apiUrl}/notifications`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('🔔 Connected to notifications');
      
      if (userId) {
        socketRef.current?.emit('subscribe', userId);
      }
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔔 Disconnected from notifications');
    });

    socketRef.current.on('new_order', (notification: OrderNotification) => {
      console.log('🔔 New order:', notification);
      setNotifications(prev => [notification, ...prev].slice(0, 50));
      playNotificationSound();
      onNewOrder?.(notification);
    });

    socketRef.current.on('order_update', (notification: OrderNotification) => {
      console.log('🔔 Order update:', notification);
      setNotifications(prev => [notification, ...prev].slice(0, 50));
      onOrderUpdate?.(notification);
    });

    socketRef.current.on('notification', (notification: GenericNotification) => {
      console.log('🔔 Notification:', notification);
      setNotifications(prev => [notification, ...prev].slice(0, 50));
      onNotification?.(notification);
    });
  }, [userId, onNewOrder, onOrderUpdate, onNotification, playNotificationSound]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      if (userId) {
        socketRef.current.emit('unsubscribe', userId);
      }
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, [userId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  return {
    isConnected,
    notifications,
    connect,
    disconnect,
    clearNotifications,
    removeNotification,
  };
}
