'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatSession, ChatMessage, WSMessage } from '@/types';
import { api } from '@/lib/api';
import { ChatWebSocket, createVisitorChat, createAdminChat } from '@/lib/websocket';

const CHAT_SESSION_KEY = 'chat_session_id';

export function useVisitorChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<ChatWebSocket | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem(CHAT_SESSION_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  // Fetch messages when session is set
  useEffect(() => {
    if (sessionId) {
      api.getSessionMessages(sessionId).then(setMessages).catch(console.error);
    }
  }, [sessionId]);

  // Connect WebSocket when session is ready
  useEffect(() => {
    if (!sessionId) return;

    const ws = createVisitorChat(sessionId);
    wsRef.current = ws;

    ws.connect()
      .then(() => setConnected(true))
      .catch(console.error);

    ws.onMessage((data: WSMessage) => {
      if (data.type === 'message' && data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message!.id || Date.now(),
            session: data.message!.session_id,
            sender_type: data.message!.sender_type,
            text: data.message!.text,
            is_read: false,
            created_at: data.message!.created_at,
          },
        ]);
      }
    });

    return () => {
      ws.disconnect();
      setConnected(false);
    };
  }, [sessionId]);

  const startChat = useCallback(async (visitorName?: string) => {
    setLoading(true);
    try {
      const storedSessionId = localStorage.getItem(CHAT_SESSION_KEY);
      const session = await api.createOrGetSession(storedSessionId || undefined, visitorName);
      localStorage.setItem(CHAT_SESSION_KEY, session.session_id);
      setSessionId(session.session_id);
      return session;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current && connected) {
      wsRef.current.send({ text });
    }
  }, [connected]);

  return {
    sessionId,
    messages,
    loading,
    connected,
    startChat,
    sendMessage,
  };
}

export function useAdminChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<ChatWebSocket | null>(null);
  const currentSessionRef = useRef<string | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    currentSessionRef.current = currentSession;
  }, [currentSession]);

  // Fetch all sessions
  const fetchSessions = useCallback(async () => {
    try {
      const data = await api.getAdminSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Connect admin WebSocket - only once
  useEffect(() => {
    const ws = createAdminChat();
    wsRef.current = ws;

    ws.connect()
      .then(() => setConnected(true))
      .catch(console.error);

    ws.onMessage((data: WSMessage) => {
      if (data.type === 'message' && data.message) {
        // Add message if it's for current session
        if (data.message.session_id === currentSessionRef.current) {
          setMessages((prev) => [
            ...prev,
            {
              id: data.message!.id || Date.now(),
              session: data.message!.session_id,
              sender_type: data.message!.sender_type,
              text: data.message!.text,
              is_read: false,
              created_at: data.message!.created_at,
            },
          ]);
        }
        // Update session list
        fetchSessions();
      } else if (data.type === 'new_message' && data.message) {
        // New visitor message notification
        fetchSessions();
      } else if (data.type === 'joined_session') {
        console.log('Joined session:', data.session_id);
      }
    });

    return () => {
      ws.disconnect();
      setConnected(false);
    };
  }, [fetchSessions]);

  const selectSession = useCallback(async (sessionId: string) => {
    setCurrentSession(sessionId);
    setLoading(true);
    try {
      const msgs = await api.getAdminSessionMessages(sessionId);
      setMessages(msgs);
      // Tell WebSocket to join this session
      if (wsRef.current) {
        wsRef.current.send({ action: 'join_session', session_id: sessionId });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current && currentSessionRef.current) {
      wsRef.current.send({ action: 'send_message', text });
    }
  }, []);

  return {
    sessions,
    currentSession,
    messages,
    loading,
    connected,
    fetchSessions,
    selectSession,
    sendMessage,
  };
}
