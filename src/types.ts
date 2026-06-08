export interface Option {
  label: string;
  points: number;
  icon?: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export type CompanyLevel = 
  | '⚫ Empresa Desorientada' 
  | '🔴 Empresa en Riesgo' 
  | '🟠 Empresa Estancada' 
  | '🟡 Empresa en Crecimiento' 
  | '🟢 Empresa Consolidada' 
  | '🔵 Empresa Escalable';

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  level: CompanyLevel;
  feedback: string;
}
