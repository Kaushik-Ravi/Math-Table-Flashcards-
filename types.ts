export interface GameSettings {
  minTable: number;
  maxTable: number;
  timerDuration: number;
  totalQuestions: number;
}

export interface Question {
  id: string;
  factorA: number;
  factorB: number;
  answer: number;
}

export interface QuestionResult {
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
  timeTaken: number; // in seconds
}

export enum GameState {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  LEARNING = 'LEARNING',
}