'use client'

import { useState } from 'react'
import { PaginationControls } from './PaginationControls'
import RecommendationsDisclosure from './RecommendationsDisclosure'

interface TestResult {
  id: string
  test_id: string
  score: number
  created_at: string
  test_title: string
  result_rule: {
    title: string
    description: string
    recommendations: string[]
  }
}

const ITEMS_PER_PAGE = 5

export default function TestResultsList({ results }: { results: TestResult[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Фильтрация результатов
  const filteredResults = results.filter(result =>
    result.test_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Пагинация
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      {/* Поисковая строка */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по названию теста..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Список результатов */}
      {paginatedResults.map((result) => (
        <div key={result.id} className="border p-4 rounded-lg mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">
                {result.test_title}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({result.score} баллов)
                </span>
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(result.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <h4 className="font-medium text-gray-800">
              {result.result_rule.title}
            </h4>
            <p className="text-gray-600 mt-1">
              {result.result_rule.description}
            </p>
          </div>

          {result.result_rule.recommendations.length > 0 && (
            <RecommendationsDisclosure 
              recommendations={result.result_rule.recommendations} 
            />
          )}
        </div>
      ))}

      {/* Пагинация */}
      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}