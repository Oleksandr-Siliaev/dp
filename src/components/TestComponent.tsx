'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Test } from '@/types'
import { User } from '@supabase/supabase-js'

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

export function TestComponent({ test }: { test: Test }) {
  const supabase = createClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<string | null>(null)
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
    // Вычисляем общий балл
    const totalScore = test.questions.reduce((acc, question, index) => {
      return acc + question.answers[answers[index]]?.score || 0
    }, 0)

    // Формируем текстовый результат
    const maxPossibleScore = test.questions.reduce((acc, q) => 
      acc + Math.max(...q.answers.map(a => a.score)), 0)
    
    const resultText = `Тест "${test.title}": ${totalScore}/${maxPossibleScore} баллов`

    // Сохраняем результат
    if (user) {
      setLoading(true)
      try {
        const { error } = await supabase
          .from('test_results')
          .insert({
            user_id: user.id,
            test_id: test.id, // Используем ID из таблицы tests
            result_text: resultText
          })

        if (error) throw error
        setResult(resultText)
      } catch (error) {
        console.error('Ошибка сохранения:', error)
        alert('Не удалось сохранить результат')
      } finally {
        setLoading(false)
      }
    } else {
      setResult(resultText)
    }
  }

  if (result !== null) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Результат теста</h2>
        <p className="mb-6">{result}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-500 text-white px-4 py-2 rounded"
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
            className={`block w-full p-2 text-left rounded ${
              answers[currentQuestion] === idx 
                ? 'bg-blue-100 border-blue-500' 
                : 'hover:bg-gray-50'
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
            className="bg-gray-200 px-4 py-2 rounded"
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Сохранение...</span>
          ) : currentQuestion < test.questions.length - 1 ? (
            'Далее'
          ) : (
            'Завершить'
          )}
        </button>
      </div>
    </div>
  )
}