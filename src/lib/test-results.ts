// src/lib/test-results.ts
import depressionTest from '@/config/tests/depression-test.json'
import anxietyTest from '@/config/tests/anxiety-test.json'

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
  return rule || config.results[config.results.length - 1] // Fallback
}