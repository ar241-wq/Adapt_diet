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

// Diet Plan Generator types
export interface DietPlanRequest {
  height: number;
  weight: number;
  allergies?: string[];
  goal?: 'lose' | 'maintain' | 'gain';
  age?: number;
  gender?: 'male' | 'female';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface Meal {
  id: number;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  restrictions: string[];
  ingredients: string[];
  contains: string[];
}

export interface DayMeals {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
  snack: Meal | null;
}

export interface DayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DayPlan {
  day: string;
  meals: DayMeals;
  totals: DayTotals;
}

export interface UserInfo {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activity_level: string;
}

export interface DietPlanResponse {
  bmr: number;
  tdee: number;
  daily_calorie_target: number;
  goal: string;
  user_info: UserInfo;
  allergies: string[];
  week_plan: DayPlan[];
}
