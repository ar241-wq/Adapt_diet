'use client';

import AdminChatPanel from '@/components/admin/AdminChatPanel';

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Respond to visitor inquiries in real-time</p>
      </div>

      <AdminChatPanel />
    </div>
  );
}
