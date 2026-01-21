'use client';

import { useEffect, useState } from 'react';
import { X, ShoppingCart, Bell } from 'lucide-react';
import { OrderNotification, GenericNotification } from '@/hooks/use-notifications';

interface NotificationToastProps {
  notifications: (OrderNotification | GenericNotification)[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Add new notifications to visible list
    notifications.forEach(n => {
      if (!visibleNotifications.includes(n.id)) {
        setVisibleNotifications(prev => [...prev, n.id]);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          setVisibleNotifications(prev => prev.filter(id => id !== n.id));
        }, 10000);
      }
    });
  }, [notifications]);

  const handleDismiss = (id: string) => {
    setVisibleNotifications(prev => prev.filter(nId => nId !== id));
    onDismiss(id);
  };

  const visibleItems = notifications.filter(n => visibleNotifications.includes(n.id)).slice(0, 5);

  if (visibleItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {visibleItems.map((notification) => {
        const isOrder = 'orderId' in notification;
        
        return (
          <div
            key={notification.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-in"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${isOrder ? 'bg-green-100' : 'bg-blue-100'}`}>
                {isOrder ? (
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                ) : (
                  <Bell className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  {isOrder ? '🛒 Novo Pedido!' : (notification as GenericNotification).title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {isOrder 
                    ? `${(notification as OrderNotification).customerName} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((notification as OrderNotification).total)}`
                    : (notification as GenericNotification).message
                  }
                </p>
                {isOrder && (
                  <p className="text-xs text-gray-400 mt-1">
                    {(notification as OrderNotification).itemsCount} item(s)
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDismiss(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
