// components/TestResultsList.tsx
'use client'

import { useState } from 'react' 
import RecommendationsDisclosure from './RecommendationsDisclosure'
import { TestResult } from '@/types'

const ITEMS_PER_PAGE = 1;

interface Props {
  results: TestResult[],
  currentPage?: number,
}

export default function TestResultsList({ results, currentPage = 1 }: Props) {
  const [searchQuery, setSearchQuery] = useState('')

  let filteredResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )
  if (!results || results.length === 0) {
    return <div className="text-center text-gray-500 py-4">Немає результатів</div>
  }
  if (searchQuery) {
    filteredResults = results.filter(result =>
      result.test_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <div className="w-full max-w-2xl px-4">
          <input
            type="text"
            placeholder="Пошук по назві тесту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 
                      focus:outline-none focus:border-blue-500 focus:ring-2 
                      focus:ring-blue-200 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResults.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 py-4">
            Нічого не знайдено
          </div>
        ) : (
          filteredResults.map((result) => (
            <div 
              key={result.id} 
              className="h-full border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {result.test_title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(result.created_at).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-400 mb-1">
                      {result.result_rule.title}
                    </h4>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {result.result_rule.description}
                    </p>
                  </div>

                  {result.result_rule.recommendations?.length > 0 && (
                    <RecommendationsDisclosure 
                      recommendations={result.result_rule.recommendations} 
                      title="Результат"
                      className="bg-blue-700"
                    />
                  )}

                  {result.personalRecommendations ? (
                    result.personalRecommendations.length > 0 ? (
                      <RecommendationsDisclosure 
                        recommendations={result.personalRecommendations}
                        title="Персональні рекомендації"
                        className="bg-blue-700"
                      />
                    ) : (
                      <div className="mt-4 bg-blue-700 p-3 rounded-lg">
                        <h4 className="font-medium text-white">
                          Ви не отримали жодної персональної рекомендації
                        </h4>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}