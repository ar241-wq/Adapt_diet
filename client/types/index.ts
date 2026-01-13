// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// Plan types
export interface Plan {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  price: string | null;
  tags: string;
  tags_list: string[];
  image: string;
  image_url: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlanFormData {
  title: string;
  short_description: string;
  full_description: string;
  price?: string;
  tags?: string;
  image?: File;
  is_active?: boolean;
}

// Lead types
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  goal: string;
  message: string;
  created_at: string;
  is_contacted: boolean;
  notes: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  goal: string;
  message: string;
}

// Chat types
export interface ChatSession {
  session_id: string;
  visitor_name: string;
  status: 'open' | 'closed';
  created_at: string;
  last_seen: string;
  unread_count: number;
  last_message: {
    text: string;
    sender_type: 'visitor' | 'admin';
    created_at: string;
  } | null;
}

export interface ChatMessage {
  id: number;
  session: string;
  sender_type: 'visitor' | 'admin';
  text: string;
  is_read: boolean;
  created_at: string;
}

// WebSocket message types
export interface WSMessage {
  type: 'message' | 'new_message' | 'joined_session';
  message?: {
    id?: number;
    session_id: string;
    sender_type: 'visitor' | 'admin';
    text: string;
    created_at: string;
  };
  session_id?: string;
}

// API response types
export interface ApiError {
  error?: string;
  detail?: string;
  [key: string]: string | string[] | undefined;
}
