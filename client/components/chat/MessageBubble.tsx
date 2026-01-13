'use client';

import { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  isAdmin?: boolean;
}

export default function MessageBubble({ message, isAdmin = false }: MessageBubbleProps) {
  const isFromVisitor = message.sender_type === 'visitor';
  const isOwn = isAdmin ? !isFromVisitor : isFromVisitor;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-400'}`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
