export interface TestSummary {
  id: string
  title: string
  description: string
  questionsCount: number
}
export interface Pagination {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
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
  recommendations?: string[]
}

export interface ProfileData {
  user_id: string
  user_email: string
  user_name: string
  role: 'user' | 'admin' // ← новая колонка
}
export interface ApiResponse<T> {
  data?: T
  error?: string
}