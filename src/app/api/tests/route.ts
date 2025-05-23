// app/api/tests/route.ts
import { NextResponse } from 'next/server'
import { TESTS } from './data/tests'
import { ApiResponse } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search')?.toLowerCase() || ''

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

    return NextResponse.json({ data: filteredTests } as ApiResponse<typeof TESTS>)
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}