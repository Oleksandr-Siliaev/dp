// app/api/tests/route.ts
import { NextResponse } from 'next/server'
import { TESTS } from './data/tests'
import { ApiResponse } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search')?.toLowerCase() || ''
    const page = Number(searchParams.get('page')) || 1
    const perPage = Number(searchParams.get('per_page')) || 5

    const filteredTests = TESTS
      .map(test => ({
        id: test.id,
        title: test.title,
        description: test.description,
        questionsCount: test.questions.length
      }))
      .filter(test => 
        test.title.toLowerCase().includes(searchQuery) ||
        test.description.toLowerCase().includes(searchQuery)
      )

    // Пагінація
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedTests = filteredTests.slice(start, end)

    return NextResponse.json({
      data: paginatedTests,
      total: filteredTests.length
    } as ApiResponse<typeof paginatedTests>)
    
  } catch {
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
}