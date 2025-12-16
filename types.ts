export interface Question {
  id: string;
  originalId: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  category: string;
  difficulty: string;
  source: 'General' | 'SciTech'; // To distinguish between the two documents
}

export type AnswerMap = Record<string, string>; // questionId -> selectedOption (e.g. 'A')

export interface QuizState {
  currentQuestionIndex: number;
  answers: AnswerMap;
  showExplanation: boolean;
  filterCategory: string | 'All';
}

export interface AnswerHistoryItem {
  timestamp: number;
  selectedOption: string;
  isCorrect: boolean;
  mode: 'practice' | 'mock';
}