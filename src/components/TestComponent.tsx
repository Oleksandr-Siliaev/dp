'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { TestDetails } from '@/types'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { getResultRule } from '@/lib/test-results'

const Progress = ({ current, total }: { current: number; total: number }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span>Прогресс:</span>
      <span>{current}/{total}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded">
      <div 
        className="h-full bg-blue-500 rounded transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
)

export function TestComponent({ test }: { test: TestDetails }) {
  const supabase = createClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<{
    score: number
    rule: ReturnType<typeof getResultRule>
  } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkAuth()
  }, [])

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const calculateResult = async () => {
    const totalScore = test.questions.reduce((acc, question, index) => {
      const answerIndex = answers[index]
      const score = question.answers[answerIndex]?.score ?? 0
      return acc + score
    }, 0)

    const rule = getResultRule(test.id, totalScore)
    setResult({ score: totalScore, rule })

    if (user) {
      setLoading(true)
      try {
        const { error } = await supabase
          .from('test_results')
          .insert({
            user_id: user.id,
            test_id: test.id,
            score: totalScore
          })

        if (error) throw error
      } catch (error) {
        console.error('Ошибка сохранения:', error)
        alert('Не удалось сохранить результат')
      } finally {
        setLoading(false)
      }
    }
  }

  if (result !== null) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Результат теста</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{result.rule.title}</h3>
          <p className="mt-2 text-gray-600">{result.rule.description}</p>
          {result.rule.recommendations?.length > 0 && (
            <div className="mt-4 text-left max-w-md mx-auto">
              <h4 className="font-medium mb-2">Рекомендации:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.rule.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {!user && (
          <div className="mb-4 p-3 bg-yellow-100 rounded-lg">
            <span className="text-yellow-800">
              Для сохранения результатов необходимо 
              <Link 
                href="/login" 
                className="ml-1 text-blue-600 hover:underline"
              >
                войти в систему
              </Link>
            </span>
          </div>
        )}

        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          На главную
        </button>
      </div>
    )
  }

  return (
    <div>
      <Progress 
        current={currentQuestion + 1} 
        total={test.questions.length} 
      />
      
      <h3 className="text-xl font-semibold mb-4">
        {test.questions[currentQuestion].text}
      </h3>

      <div className="space-y-2">
        {test.questions[currentQuestion].answers.map((answer, idx) => (
          <button
            key={answer.id}
            onClick={() => handleAnswer(idx)}
            className={`block w-full p-2 text-left rounded border transition-all ${
              answers[currentQuestion] === idx 
                ? 'bg-blue-100 border-blue-500 scale-[0.98]' 
                : 'hover:bg-gray-50 border-transparent'
            }`}
          >
            {answer.text}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Назад
          </button>
        )}
        
        <button
          onClick={() => {
            if (currentQuestion < test.questions.length - 1) {
              setCurrentQuestion(prev => prev + 1)
            } else {
              calculateResult()
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ml-auto"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Сохранение...</span>
          ) : currentQuestion < test.questions.length - 1 ? (
            'Далее →'
          ) : (
            'Завершить тест'
          )}
        </button>
      </div>
    </div>
  )
}