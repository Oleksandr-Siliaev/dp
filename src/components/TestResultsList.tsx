// components/TestResultsList.tsx
'use client'

import { useState } from 'react' // Добавляем импорт useState
import RecommendationsDisclosure from './RecommendationsDisclosure'
import { TestResult } from '@/types'

interface Props {
  results: TestResult[]
}

export default function TestResultsList({ results }: Props) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResults = results.filter(result =>
    result.test_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Поисковая строка */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Пошук по назві тесту..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Список результатов */}
      {filteredResults.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          Ничего не найдено
        </div>
      ) : (
        filteredResults.map((result) => (
          <div key={result.id} className="border p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {result.test_title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(result.created_at).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-medium text-gray-400">
                {result.result_rule.title}
              </h4>
              <p className="text-gray-400 mt-1">
                {result.result_rule.description}
              </p>
            </div>

            {result.result_rule.recommendations?.length > 0 && (
              <RecommendationsDisclosure 
                recommendations={result.result_rule.recommendations} 
                title="Загальні рекомендації"
              />
            )}

            {/* Исправление для второй ошибки */}
            {result.personalRecommendations && 
            result.personalRecommendations.length > 0 && (
              <RecommendationsDisclosure 
                recommendations={result.personalRecommendations}
                title="Персональні рекомендації"
              />
            )}
          </div>
        ))
      )}
    </div>
  )
}