// app/admin/add-test/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TestRuleForm {
  minScore: string
  maxScore: string
  title: string
  description: string
  recommendations: string
}

interface AnswerForm {
  text: string
  score: string
  recommendations: string
}

interface QuestionForm {
  text: string
  answers: AnswerForm[]
}

export default function AddTestPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    testTitle: '',
    testDescription: ''
  })

  const [rules, setRules] = useState<TestRuleForm[]>([{
    minScore: '',
    maxScore: '',
    title: '',
    description: '',
    recommendations: ''
  }])

  const [questions, setQuestions] = useState<QuestionForm[]>([{ 
    text: '', 
    answers: [{ text: '', score: '', recommendations: '' }] 
  }])

  const addQuestion = () => {
    setQuestions([...questions, { 
      text: '', 
      answers: [{ text: '', score: '', recommendations: '' }] 
    }])
  }

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers.push({ 
      text: '', 
      score: '', 
      recommendations: '' 
    })
    setQuestions(newQuestions)
  }

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers.splice(answerIndex, 1)
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!formData.testTitle || !formData.testDescription) {
        throw new Error('Заповніть назву і опис тесту')
      }

      const testData = {
        title: formData.testTitle,
        description: formData.testDescription,
        rules: rules.map(rule => ({
          minScore: parseInt(rule.minScore),
          maxScore: parseInt(rule.maxScore),
          title: rule.title,
          description: rule.description,
          recommendations: rule.recommendations.split('\n').filter(r => r.trim())
        })),
        questions: questions.map((question, qIndex) => ({
          id: qIndex + 1,
          text: question.text,
          answers: question.answers.map((answer, aIndex) => ({
            id: aIndex + 1,
            text: answer.text,
            score: parseInt(answer.score),
            recommendations: answer.recommendations.split('\n').filter(r => r.trim())
          }))
        })),
        createdAt: new Date().toISOString()
      }

      const response = await fetch('/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      if (!response.ok) throw new Error('Помилка відправки форми')

      setSuccess('Тест успішно відправлено на модерацію!')
      setFormData({ testTitle: '', testDescription: '' })
      setRules([{ minScore: '', maxScore: '', title: '', description: '', recommendations: '' }])
      setQuestions([{ text: '', answers: [{ text: '', score: '', recommendations: '' }] }])
      
      router.refresh()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Виникла невідома помилка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Додати новий тест</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Назва тесту</label>
            <input
              type="text"
              value={formData.testTitle}
              onChange={e => setFormData({...formData, testTitle: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Опис тесту</label>
            <textarea
              value={formData.testDescription}
              onChange={e => setFormData({...formData, testDescription: e.target.value})}
              className="w-full p-2 border rounded h-24"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Логіка результатів</h2>
          
          {rules.map((rule, index) => (
            <div key={index} className="p-4 border rounded space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Мінімальний бал</label>
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
                  <label className="block mb-2">Максимальний бал</label>
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
                <label className="block mb-2">Заголовок результату</label>
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
                <label className="block mb-2">Опис</label>
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
                <label className="block mb-2">Рекомендації</label>
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
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-300 text-white"
          >
            Додати правило
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Питання</h2>
          
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="p-4 border rounded space-y-4">
              <div>
                <label className="block mb-2">Питання {qIndex + 1}</label>
                <textarea
                  value={question.text}
                  onChange={e => {
                    const newQuestions = [...questions]
                    newQuestions[qIndex].text = e.target.value
                    setQuestions(newQuestions)
                  }}
                  className="w-full p-2 border rounded h-24"
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Варіанти відповідей:</h3>
                
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="p-3 border rounded space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1">Текст відповіді</label>
                        <input
                          type="text"
                          value={answer.text}
                          onChange={e => {
                            const newQuestions = [...questions]
                            newQuestions[qIndex].answers[aIndex].text = e.target.value
                            setQuestions(newQuestions)
                          }}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-1">Бали</label>
                        <input
                          type="number"
                          value={answer.score}
                          onChange={e => {
                            const newQuestions = [...questions]
                            newQuestions[qIndex].answers[aIndex].score = e.target.value
                            setQuestions(newQuestions)
                          }}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1">Рекомендації</label>
                      <textarea
                        value={answer.recommendations}
                        onChange={e => {
                          const newQuestions = [...questions]
                          newQuestions[qIndex].answers[aIndex].recommendations = e.target.value
                          setQuestions(newQuestions)
                        }}
                        className="w-full p-2 border rounded h-20"
                        placeholder="Кожна з нового рядка"
                      />
                    </div>

                    {question.answers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAnswer(qIndex, aIndex)}
                        className="text-red-500 text-sm hover:underline"
                      >
                       Видалити відповідь
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addAnswer(qIndex)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  + Додати варіант відповіді
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            + Додати питання
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Відправка...' : 'Відправити на модерацію'}
        </button>
      </form>
    </div>
  )
}