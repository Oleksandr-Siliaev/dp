// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { TestCard } from '@/components/TestCard'
import { TestSummary } from '@/types'
import { PaginationControls } from '@/components/PaginationControls'

const ITEMS_PER_PAGE = 10

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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTests(currentPage, searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, currentPage])

  const handlePageChange = (newPage: number) => {
    console.log('Changing to page:', newPage)
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  return (
  <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-8 text-center">Доступні тести</h1>
    
<div className="mb-8 flex justify-center">
      <div className="w-full max-w-2xl px-4"> {/* Добавляем ограничение по ширине */}
        <input
          type="text"
          placeholder="Пошук по назві тесту..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1) 
          }}
          className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 
                     focus:outline-none focus:border-blue-500 focus:ring-2 
                     focus:ring-blue-200 transition-all"
        />
      </div>
    </div>

    {loading ? (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg" />
        ))}
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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