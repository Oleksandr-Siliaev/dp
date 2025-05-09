export interface TestSummary {
  id: string
  title: string
  description: string
  questionsCount: number
}

export interface TestDetails extends TestSummary {
  questions: Question[]
}

interface Question {
  id: number
  text: string
  answers: Answer[]
}

interface Answer {
  id: number
  text: string
  score: number 
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}