export type QuestionType = 
  | "warmup"
  | "roleplay"
  | "opinion"
  | "narration"
  | "summary";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  timeLimit?: number; // seconds
  level: "IH" | "AL";
  topic?: string; // 주제 (예: "school", "work", "travel")
  sampleAnswer?: string; // 모범 답안
  usefulExpressions?: string[]; // 유용한 표현 목록
  audioPath?: string; // 모범 답안 오디오 파일 경로
}

export interface Answer {
  questionId: string;
  audioData?: string; // base64 encoded audio data
  audioMimeType?: string; // e.g., "audio/webm"
  transcript?: string;
  duration: number; // seconds
  timestamp: number;
}

export interface EvaluationCriteria {
  fluency: number; // 0-5
  accuracy: number; // 0-5
  vocabulary: number; // 0-5
  grammar: number; // 0-5
  pronunciation: number; // 0-5
}

export interface Feedback {
  overallScore: number; // 0-5
  criteria: EvaluationCriteria;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailedFeedback: string;
}

export interface TestResult {
  id: string;
  testDate: number; // timestamp
  level: "IH" | "AL";
  questions: Question[];
  answers: Answer[];
  feedback?: Feedback;
  completed: boolean;
}

export interface TestSession {
  currentQuestionIndex: number;
  startTime: number;
  answers: Answer[];
  isRecording: boolean;
  isEvaluating: boolean;
}

