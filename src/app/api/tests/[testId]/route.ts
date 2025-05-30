// src/app/api/tests/[testId]/route.ts
import { NextResponse } from 'next/server'
import { TESTS } from '../data/tests'
import { ApiResponse, TestDetails } from '@/types'


export async function GET(
  request: Request,

) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')
    const test = TESTS.find(t => t.id === testId)

    if (!test) {
      return NextResponse.json(
        { error: 'Тест не знайдено' },
        { status: 404 }
      )
    }

    const responseData: TestDetails = {
      id: test.id,
      title: test.title,
      description: test.description,
      questionsCount: test.questions.length,
      questions: test.questions.map(question => ({
        ...question,
        answers: question.answers.map(answer => ({
          id: answer.id,
          text: answer.text,
          score: answer.score
        }))
      }))
    }

    return NextResponse.json({
      data: responseData
    } as ApiResponse<TestDetails>)

  } catch {
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
}