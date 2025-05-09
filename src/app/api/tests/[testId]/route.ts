// src/app/api/tests/[testId]/route.ts
import { NextResponse } from 'next/server'
import { TESTS } from '../data/tests'
import { ApiResponse, TestDetails } from '@/types' // Добавляем импорт TestDetails

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    const testId = params.testId
    const test = TESTS.find(t => t.id === testId)

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Формируем полный объект TestDetails
    const responseData: TestDetails = {
      id: test.id,
      title: test.title,
      description: test.description,
      questionsCount: test.questions.length, // Добавляем обязательное поле
      questions: test.questions.map(question => ({
        ...question,
        answers: question.answers.map(answer => ({
          id: answer.id,
          text: answer.text,
          score: answer.score // Добавляем score в ответ
        }))
      }))
    }

    return NextResponse.json({
      data: responseData
    } as ApiResponse<TestDetails>) // Явно указываем тип

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}