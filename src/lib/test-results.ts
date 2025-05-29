// src/lib/test-results.ts
import depressionTest from '@/config/tests/depression-test.json'
import anxietyTest from '@/config/tests/anxiety-test.json'
import panicDisorderTest from '@/config/tests/panic-disorder-test.json'
import ptsdTest from '@/config/tests/ptsd-test.json'
import hypomaniaTest from '@/config/tests/hypomania-test.json'
import suicideRiskTest from '@/config/tests/suicide-risk-test.json'
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

type SelectedAnswer = {
  questionId: number
  answerId: number
}

const tests: Record<string, TestConfig> = {
  'depression-test': depressionTest,
  'anxiety-test': anxietyTest,
  'panic-disorder-test': panicDisorderTest,
  'ptsd-test': ptsdTest,
  'hypomania-test': hypomaniaTest,
  'suicide-risk-test': suicideRiskTest
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

export function getPersonalRecommendations(testId: string, selectedAnswers: SelectedAnswer[]): string[] {
  const test = TESTS.find(t => t.id === testId)
  if (!test) return []

  const recommendationsWithPriority = selectedAnswers.flatMap(answer => {
    const question = test.questions.find(q => q.id === answer.questionId)
    const answerData = question?.answers.find(a => a.id === answer.answerId)
    
    return answerData?.recommendations?.map(rec => ({
      text: rec,
      priority: answerData.score 
    })) || []
  })

  const uniqueRecs = Array.from(new Map(
    recommendationsWithPriority
      .sort((a, b) => b.priority - a.priority) 
      .map(item => [item.text, item]) 
  ).values())

  return uniqueRecs.map(rec => rec.text)
}