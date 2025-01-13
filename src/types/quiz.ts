export type QuestionType = "multiple_choice" | "true_false";

export interface Question {
  question: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
  order_number: number;
}

export interface QuizFormData {
  title: string;
  description?: string;
  content_id?: string;
  passing_score: number;
  preview_enabled: boolean;
  questions: Question[];
}