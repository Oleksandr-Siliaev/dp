// src/lib/test-results.ts
import depressionTest from '@/config/tests/depression-test.json'
import anxietyTest from '@/config/tests/anxiety-test.json'
import { TESTS } from '@/app/api/tests/data/tests'

type TestRule = {
  minScore: number
  maxScore: number
  title: string
  description: string
  recommendations: string[]
}

type TestConfig = {
  id: string
  title: string
  results: TestRule[]
}

// Добавляем новый тип для выбранных ответов
type SelectedAnswer = {
  questionId: number
  answerId: number
}

const tests: Record<string, TestConfig> = {
  'depression-test': depressionTest,
  'anxiety-test': anxietyTest
}

export function getTestConfig(testId: string): TestConfig {
  const config = tests[testId]
  if (!config) throw new Error(`Test config not found: ${testId}`)
  return config
}

export function getResultRule(testId: string, score: number): TestRule {
  const config = getTestConfig(testId)
  const rule = config.results.find(r => score >= r.minScore && score <= r.maxScore)
  return rule || config.results[config.results.length - 1]
}

// Добавляем новую функцию для получения персональных рекомендаций
export function getPersonalRecommendations(testId: string, selectedAnswers: SelectedAnswer[]): string[] {
  const test = TESTS.find(t => t.id === testId)
  if (!test) return []

  return selectedAnswers
    .flatMap(answer => {
      const question = test.questions.find(q => q.id === answer.questionId)
      return question?.answers.find(a => a.id === answer.answerId)?.recommendations || []
    })
    .filter((rec, index, arr) => rec && arr.indexOf(rec) === index) // Удаляем дубликаты
}