// API Response Types
export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Language Types
export type Language = 'fa' | 'en' | 'ar' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

export interface LanguageOption {
  code: Language;
  name: string;
  direction: 'ltr' | 'rtl';
}

// Architect Data Types
export interface RoleData {
  title: string;
  description: string;
  color: string;
  icon: string;
  tasks: TaskData[];
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  fields: FieldData[];
  promptTemplate: string;
}

export interface FieldData {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// Form Types
export interface FormData {
  [key: string]: string | string[] | number | boolean;
}

// App State Types
export interface AppSettings {
  apiKey: string;
  language: Language;
  theme: 'light' | 'dark' | 'auto';
}

// Navigation Types
export type NavigationPath = '/' | '/architect' | '/settings';

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: string;
} 