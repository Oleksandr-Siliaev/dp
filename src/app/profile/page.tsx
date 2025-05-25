// app/profile/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTestConfig, getResultRule,getPersonalRecommendations } from '@/lib/test-results'
import { PaginationControls } from '@/components/PaginationControls'
import TestResultsList from '@/components/TestResultsList'

interface TestResult {
  id: string
  test_id: string
  score: number
  created_at: string
  test_title: string
  selected_answers?: Array<{  // Добавить новое поле
    questionId: number
    answerId: number
  }>
  result_rule: {
    title: string
    description: string
    recommendations: string[]
  }
  personalRecommendations?: string[] // Добавить новое поле
}

const ITEMS_PER_PAGE = 5

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  const currentPage = Number(searchParams?.page) || 1

  // Аутентификация
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  // Получение профиля
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_email, user_name')
    .eq('user_id', user.id)
    .single()

  // Запрос результатов с пагинацией
  const { data: results, count } = await supabase
  .from('test_results')
  .select('id, test_id, score, created_at, selected_answers', { count: 'exact' }) // Добавить selected_answers
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)

  // Обработка результатов
  const formattedResults = results?.map(result => ({
  id: result.id,
  test_id: result.test_id,
  score: result.score,
  created_at: result.created_at,
  selected_answers: result.selected_answers, // Сохраняем выбранные ответы
  ...getTestDetails(
    result.test_id, 
    result.score,
    result.selected_answers as Array<{ questionId: number, answerId: number }> // Приведение типа
  )
})) || []

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto p-4">
      {/* Секция профиля */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold mb-4">Ваш профиль</h1>
        <div className="space-y-2">
          <p><span className="font-semibold">Имя:</span> {profile?.user_name || 'Не указано'}</p>
          <p><span className="font-semibold">Email:</span> {profile?.user_email}</p>
        </div>
      </div>

      {/* Секция результатов с поиском */}
      <TestResultsList results={formattedResults} />
      
      {/* Серверная пагинация */}
      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

// Вспомогательная функция для получения данных теста
function getTestDetails(testId: string, score: number, selectedAnswers?: Array<{ 
  questionId: number
  answerId: number 
}>) {
  try {
    const config = getTestConfig(testId)
    const rule = getResultRule(testId, score)
    const personalRecommendations = selectedAnswers 
      ? getPersonalRecommendations(testId, selectedAnswers)
      : []
      
    return {
      test_title: config.title,
      result_rule: {
        title: rule.title,
        description: rule.description,
        recommendations: rule.recommendations
      },
      personalRecommendations // Добавить персонализированные рекомендации
    }
  } catch (error) {
    return {
      test_title: 'Неизвестный тест',
      result_rule: {
        title: 'Результат недоступен',
        description: 'Информация о тесте устарела',
        recommendations: []
      },
      personalRecommendations: []
    }
  }
}