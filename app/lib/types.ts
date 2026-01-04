export interface Analysis {
  id: string;
  user_id: string;
  code: string;
  language: string;
  time_complexity: string;
  space_complexity: string;
  explanation: string;
  optimizations?: string;
  created_at: string;
}

export interface AnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  optimizations?: string;
  canAnalyze: boolean;
  refusalReason?: string;
}