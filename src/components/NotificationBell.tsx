import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [hasNotifications] = useState(true);

  return (
    <button className="relative p-2">
      <Bell className="w-6 h-6 text-gray-600" />
      {hasNotifications && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}