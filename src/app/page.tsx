// src/app/page.tsx 
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TestCard } from '@/components/TestCard'
import { TestSummary } from '@/types'

export default function Home() {
  const [tests, setTests] = useState<TestSummary[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
    useEffect(() => {
    const fetchTests = async () => {
      try {
        const url = searchQuery 
          ? `/api/tests?search=${encodeURIComponent(searchQuery)}`
          : '/api/tests'
          
        const response = await fetch(url)
        const { data } = await response.json()
        setTests(data || [])
      } catch (error) {
        console.error('Failed to fetch tests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [searchQuery])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Доступные тесты</h1>
      <div className="grid gap-4">
        {tests.map(test => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  )
}