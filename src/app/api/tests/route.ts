// src/app/api/tests/route.ts
import { NextResponse } from 'next/server'
import { TESTS } from './data/tests'
import { ApiResponse } from '@/types'

export async function GET() {
  try {
    // Для имитации реального API добавим задержку
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({
      data: TESTS.map(test => ({
        id: test.id,
        title: test.title,
        description: test.description,
        questionsCount: test.questions.length
      }))
    } as ApiResponse<typeof TESTS>)
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}