//src/types/index.ts
export interface Test {
    id: string
    title: string
    description: string
    questions: Question[]
  }
  
  export interface Question {
    id: number
    text: string
    answers: Answer[]
  }
  
  export interface Answer {
    id: number
    text: string
    score: number
  }