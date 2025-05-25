// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { TestCard } from '@/components/TestCard'
import { TestSummary } from '@/types'
import { PaginationControls } from '@/components/PaginationControls'

const ITEMS_PER_PAGE = 5 // Количество элементов на странице

export default function Home() {
  const [tests, setTests] = useState<TestSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchTests = async (page: number, search: string) => {
    try {
      setLoading(true)
      const url = `/api/tests?search=${encodeURIComponent(search)}&page=${page}&per_page=${ITEMS_PER_PAGE}`
      const response = await fetch(url)
      const { data, total } = await response.json()
      
      setTests(data || [])
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Ошибка загрузки тестов:', error)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка данных при изменении страницы или поискового запроса
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTests(currentPage, searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, currentPage])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Доступные тесты</h1>
      
      {/* Поле поиска */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по названию теста..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1) // Сброс на первую страницу при новом поиске
          }}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {tests.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>

          {/* Пагинация */}
          <div className="flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  )
}