export enum BizMode {
  SUPPORT = 'SUPPORT',
  MARKETING = 'MARKETING',
  DATA = 'DATA',
  OPS = 'OPS'
}

export interface ChatFeedback {
  rating: 'positive' | 'negative';
  comment?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: ChatFeedback;
  image?: string; // Base64 encoded image string
}

export interface DataAnalysisResult {
  summary: string;
  insights: string[];
  chartData: {
    label: string;
    value: number;
  }[];
  recommendation: string;
}

export interface ModeConfig {
  id: BizMode;
  label: string;
  icon: string; // Lucide icon name mapping
  description: string;
  placeholder: string;
  systemInstruction: string;
}