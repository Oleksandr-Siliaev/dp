// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { TestCard } from '@/components/TestCard'
import { TestSummary } from '@/types'

export default function Home() {
  const [tests, setTests] = useState<TestSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTests, setFilteredTests] = useState<TestSummary[]>([])

  // Загрузка тестов с debounce
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/tests?search=${encodeURIComponent(searchQuery)}`
        const response = await fetch(url)
        const { data } = await response.json()
        setTests(data || [])
        setFilteredTests(data || [])
      } catch (error) {
        console.error('Ошибка загрузки тестов:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchData()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Доступные тесты</h1>
      
      {/* Поле поиска */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по названию теста..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTests.map(test => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}
    </div>
  )
}