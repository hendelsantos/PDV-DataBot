'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { NotificationToast } from '@/components/notifications/notification-toast';
import { useNotifications } from '@/hooks/use-notifications';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | undefined>();

  // Get user ID from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.sub);
      } catch (e) {
        console.error('Failed to decode token');
      }
    }
  }, []);

  const { notifications, removeNotification, isConnected } = useNotifications({
    userId,
    playSound: true,
    onNewOrder: (notification) => {
      console.log('Novo pedido recebido:', notification);
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header isNotificationsConnected={isConnected} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
      
      {/* Notification Toast */}
      <NotificationToast
        notifications={notifications}
        onDismiss={removeNotification}
      />
    </div>
  );
}
