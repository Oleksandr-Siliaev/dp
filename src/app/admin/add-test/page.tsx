// app/admin/add-test/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

interface TestRuleForm {
  minScore: string
  maxScore: string
  title: string
  description: string
  recommendations: string
}

interface QuestionForm {
  text: string
}

export default function AddTestPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Основные поля формы
  const [formData, setFormData] = useState({
    testTitle: '',
    testDescription: '',
    answers: 'Никогда, Иногда, Часто', // Шаблон ответов по умолчанию
    answersScores: '0, 1, 2' // Баллы для ответов
  })

  // Логика результатов
  const [rules, setRules] = useState<TestRuleForm[]>([{
    minScore: '',
    maxScore: '',
    title: '',
    description: '',
    recommendations: ''
  }])

  // Вопросы
  const [questions, setQuestions] = useState<QuestionForm[]>([{ text: '' }])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Валидация
      if (!formData.testTitle || !formData.testDescription) {
        throw new Error('Заполните название и описание теста')
      }

      if (questions.some(q => !q.text)) {
        throw new Error('Все вопросы должны иметь текст')
      }

      // Формируем данные для отправки
      const testData = {
        title: formData.testTitle,
        description: formData.testDescription,
        answers: formData.answers.split(',').map(a => a.trim()),
        scores: formData.answersScores.split(',').map(s => parseInt(s.trim())),
        rules: rules.map(rule => ({
          minScore: parseInt(rule.minScore),
          maxScore: parseInt(rule.maxScore),
          title: rule.title,
          description: rule.description,
          recommendations: rule.recommendations.split('\n')
        })),
        questions: questions.map(q => ({ text: q.text })),
        createdAt: new Date().toISOString()
      }

      // Отправка на email через API
      const response = await fetch('/api/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      if (!response.ok) throw new Error('Ошибка отправки формы')

      setSuccess('Тест успешно отправлен на модерацию!')
      // Сброс формы
      setFormData({ testTitle: '', testDescription: '', answers: '', answersScores: '' })
      setRules([{ minScore: '', maxScore: '', title: '', description: '', recommendations: '' }])
      setQuestions([{ text: '' }])

    } catch (err: any) {
      setError(err.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Добавить новый тест</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основные поля */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Название теста</label>
            <input
              type="text"
              value={formData.testTitle}
              onChange={e => setFormData({...formData, testTitle: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Описание теста</label>
            <textarea
              value={formData.testDescription}
              onChange={e => setFormData({...formData, testDescription: e.target.value})}
              className="w-full p-2 border rounded h-24"
              required
            />
          </div>
        </div>

        {/* Шаблон ответов */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Шаблон ответов</h2>
          
          <div>
            <label className="block mb-2 font-medium">
              Варианты ответов (через запятую)
            </label>
            <input
              type="text"
              value={formData.answers}
              onChange={e => setFormData({...formData, answers: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Баллы для ответов (через запятую)
            </label>
            <input
              type="text"
              value={formData.answersScores}
              onChange={e => setFormData({...formData, answersScores: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Логика результатов */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Логика результатов</h2>
          
          {rules.map((rule, index) => (
            <div key={index} className="p-4 border rounded space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Минимальный балл</label>
                  <input
                    type="number"
                    value={rule.minScore}
                    onChange={e => {
                      const newRules = [...rules]
                      newRules[index].minScore = e.target.value
                      setRules(newRules)
                    }}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Максимальный балл</label>
                  <input
                    type="number"
                    value={rule.maxScore}
                    onChange={e => {
                      const newRules = [...rules]
                      newRules[index].maxScore = e.target.value
                      setRules(newRules)
                    }}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Заголовок результата</label>
                <input
                  type="text"
                  value={rule.title}
                  onChange={e => {
                    const newRules = [...rules]
                    newRules[index].title = e.target.value
                    setRules(newRules)
                  }}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Описание</label>
                <textarea
                  value={rule.description}
                  onChange={e => {
                    const newRules = [...rules]
                    newRules[index].description = e.target.value
                    setRules(newRules)
                  }}
                  className="w-full p-2 border rounded h-24"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Рекомендации (каждая с новой строки)</label>
                <textarea
                  value={rule.recommendations}
                  onChange={e => {
                    const newRules = [...rules]
                    newRules[index].recommendations = e.target.value
                    setRules(newRules)
                  }}
                  className="w-full p-2 border rounded h-32"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setRules([...rules, {
              minScore: '',
              maxScore: '',
              title: '',
              description: '',
              recommendations: ''
            }])}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Добавить правило
          </button>
        </div>

        {/* Вопросы */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Вопросы</h2>
          
          {questions.map((question, index) => (
            <div key={index} className="p-4 border rounded">
              <label className="block mb-2">Вопрос {index + 1}</label>
              <textarea
                value={question.text}
                onChange={e => {
                  const newQuestions = [...questions]
                  newQuestions[index].text = e.target.value
                  setQuestions(newQuestions)
                }}
                className="w-full p-2 border rounded h-24"
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setQuestions([...questions, { text: '' }])}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Добавить вопрос
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Отправить на модерацию'}
        </button>
      </form>
    </div>
  )
}