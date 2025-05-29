// app/profile/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTestConfig, getResultRule, getPersonalRecommendations } from '@/lib/test-results'
import { PaginationControls } from '@/components/PaginationControls'
import TestResultsList from '@/components/TestResultsList'

const ITEMS_PER_PAGE = 10

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const Params = await searchParams
  const supabase = await createClient()
  const currentPage = Number(Params?.page) || 1

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_email, user_name')
    .eq('user_id', user.id)
    .single()

 
  const { data: results, count } = await supabase
    .from('test_results')
    .select('id, test_id, score, created_at, selected_answers', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    //.range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)

  const formattedResults = results?.map(result => ({
    id: result.id,
    test_id: result.test_id,
    score: result.score,
    created_at: result.created_at,
    selected_answers: result.selected_answers,
    ...getTestDetails(
      result.test_id, 
      result.score,
      result.selected_answers as Array<{ questionId: number, answerId: number }>
    )
  })) || []

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto p-4 text-white">

      <div className="mb-8 border-b pb-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Ваш профіль</h1>
        <div className="space-y-2">
        <p><span className="font-semibold">Ім&apos;я:</span> {profile?.user_name || 'Не вказано'}</p>
          <p><span className="font-semibold">Email:</span> {profile?.user_email}</p>
        </div>
      </div>


      <TestResultsList results={formattedResults} />

      <div className="mt-6 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

function getTestDetails(testId: string, score: number, selectedAnswers?: Array<{ 
  questionId: number
  answerId: number 
}>) {
  try {
    const config = getTestConfig(testId)
    const rule = getResultRule(testId, score)
    const personalRecommendations = selectedAnswers 
      ? getPersonalRecommendations(
          testId,
          selectedAnswers.map(a => ({
            questionId: a.questionId,
            answerId: a.answerId
          }))
        )
      : []

    return {
      test_title: config.title,
      result_rule: {
        title: rule.title,
        description: rule.description,
        recommendations: rule.recommendations
      },
      personalRecommendations
    }
  } catch {
    return {
      test_title: 'Невідомий тест',
      result_rule: {
        title: 'Результат недоступний',
        description: 'Інформація про тест застаріла',
        recommendations: []
      },
      personalRecommendations: []
    }
  }
}