// components/TestComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { TestDetails } from '@/types'
import { getResultRule, getPersonalRecommendations } from '@/lib/test-results'

const Progress = ({ current, total }: { current: number; total: number }) => (
  <div className="mb-6">
    <div className="flex justify-between text-sm mb-2">
      <span className="text-gray-400">Прогрес:</span>
      <span className="text-gray-400">{current}/{total}</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full">
      <div 
        className="h-full bg-blue-600 rounded-full transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
)

export function TestComponent({ test }: { test: TestDetails }) {
  const supabase = createClient()
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<{
    score: number
    rule: ReturnType<typeof getResultRule>
  } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const savedProgress = localStorage.getItem(`testProgress_${test.id}`)
    if (savedProgress) {
      try {
        const { savedQuestion, savedAnswers } = JSON.parse(savedProgress)
        setCurrentQuestion(savedQuestion)
        setAnswers(savedAnswers)
      } catch (e) {
        console.error('Помилка відновлення прогресу:', e)
      }
    }
    setHasHydrated(true)
  }, [test.id])

  useEffect(() => {
    if (!hasHydrated) return
    
    const progress = {
      savedQuestion: currentQuestion,
      savedAnswers: answers
    }
    localStorage.setItem(`testProgress_${test.id}`, JSON.stringify(progress))
  }, [currentQuestion, answers, test.id, hasHydrated])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkAuth()
  }, [supabase.auth]) 

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
    setErrorMessage('')
  }

  const validateCurrentAnswer = () => {
    return answers[currentQuestion] !== undefined
  }

  const handleNext = () => {
    if (!validateCurrentAnswer()) {
      setErrorMessage('Будь ласка, оберіть відповідь перед продовженням')
      return
    }
    
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setErrorMessage('')
    } else {
      calculateResult()
    }
  }

  const calculateResult = async () => {
    if (!validateCurrentAnswer()) {
      setErrorMessage('Будь ласка, дайте відповідь на останнє запитання')
      return
    }

    const totalScore = test.questions.reduce((acc, question, index) => {
      const answerIndex = answers[index]
      const score = question.answers[answerIndex]?.score ?? 0
      return acc + score
    }, 0)

    const rule = getResultRule(test.id, totalScore)
    setResult({ score: totalScore, rule })
    localStorage.removeItem(`testProgress_${test.id}`)

    const selectedAnswers = test.questions.map((question, index) => ({
      questionId: question.id,
      answerId: question.answers[answers[index]]?.id,
      questionText: question.text,
      answerText: question.answers[answers[index]]?.text
    }))

    if (user) {
      setLoading(true)
      try {
        const { error } = await supabase
          .from('test_results')
          .insert({
            user_id: user.id,
            test_id: test.id,
            score: totalScore,
            selected_answers: selectedAnswers
          })

        if (error) throw error
      } catch (error) {
        console.error('Помилка збереження:', error)
        alert('Не вдалося зберегти результат')
      } finally {
        setLoading(false)
      }
    }
  }

  if (!hasHydrated) {
    return <div className="text-center p-4">Завантаження прогресу...</div>
  }

  if (result !== null) {
    const selectedAnswersForRecommendations = test.questions.map((question, index) => ({
      questionId: question.id,
      answerId: question.answers[answers[index]]?.id
    }))

    const personalRecommendations = getPersonalRecommendations(test.id, selectedAnswersForRecommendations)

    return (
      <div className="flex justify-center items-start min-h-screen pt-8">
    <div className="w-full max-w-3xl mx-4  border border-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Результат тесту</h2>
        
        <div className="mb-6">
          <h3 className="text-lg text-center font-semibold text-white">{result.rule.title}</h3>
          <p className="mt-2 text-center text-gray-500">{result.rule.description}</p>
          {result.rule.recommendations?.length > 0 && (
            <div className="mt-4 text-left max-w-md mx-auto">
              <h4 className="font-medium mb-2 text-white">Загальний результат:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.rule.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-white">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {personalRecommendations.length > 0 && (
          <div className="mb-6 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Персональні рекомендації:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {personalRecommendations.map((rec, i) => (
                <li 
                  key={i} 
                  className={`text-sm ${i === 0 ? 'font-semibold' : ''} text-gray-500`}
                >
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

<div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          На головну
        </button>
        <button
          onClick={() => {
            localStorage.removeItem(`testProgress_${test.id}`)
            window.location.reload()
          }}
          className="bg-gray-600 px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
        >
          Почати знову
        </button>
      </div>
    </div>
  </div>
)
  }


 return (
  <div className="flex justify-center items-start min-h-screen pt-8">
    <div className="w-full max-w-3xl mx-4 border border-white rounded-xl shadow-sm p-6">
      
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-center text-white">
          {test.questions[currentQuestion].text}
        </h3>

        <div className="grid gap-3">
          {test.questions[currentQuestion].answers.map((answer, idx) => (
            <button
              key={answer.id}
              onClick={() => handleAnswer(idx)}
              className={`
                p-4 text-left rounded-lg border transition-all text-white
                ${answers[currentQuestion] === idx 
                  ? 'bg-blue-600 border-blue-500 scale-[0.98]' 
                  : 'hover:bg-gray-600 border-gray-200'}
              `}
            >
              {answer.text}
            </button>
          ))}
        </div>
          <Progress 
        current={currentQuestion + 1} 
        total={test.questions.length} 
      />
        <div className="flex justify-between gap-4">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              className="bg-gray-500 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Назад
            </button>
          )}
          
          <button
            onClick={handleNext}
            className={`
              bg-blue-600 text-white px-8 py-3 rounded-lg ml-auto
              hover:bg-blue-700 transition-colors
              ${loading ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {loading ? (
              <span className="animate-pulse">Збереження...</span>
            ) : currentQuestion < test.questions.length - 1 ? (
              'Далі →'
            ) : (
              'Завершити тест'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)
}