// app/admin/page.tsx
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PaginationControls } from '@/components/PaginationControls'
import { TestResult } from '@/types'
import RecommendationsDisclosure from '@/components/RecommendationsDisclosure'
import { getTestConfig, getResultRule, getPersonalRecommendations } from '@/lib/test-results'

const ITEMS_PER_PAGE = 5

type AdminTestResult = TestResult & {
  test_title: string
  result_rule: {
    title: string
    description: string
    recommendations: string[]
  }
  personalRecommendations: string[]
}

// Remove custom PageProps and let Next.js handle the type
export default async function AdminPage({ searchParams }: { searchParams?: { page?: string; email?: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const emailQuery = searchParams?.email?.toString() || ''
  const currentPage = Number(searchParams?.page) || 1

  const { data: users } = await supabase
    .from('profiles')
    .select('user_id, user_email')
    .ilike('user_email', `%${emailQuery}%`)
    .limit(5)

  let userResults: AdminTestResult[] = []
  let totalResults = 0
  let selectedUserEmail = ''

  if (emailQuery) {
    const exactUser = users?.find(u => 
      u.user_email.toLowerCase() === emailQuery.toLowerCase()
    )

    if (exactUser) {
      selectedUserEmail = exactUser.user_email
      
      const { data: results, count } = await supabase
        .from('test_results')
        .select('id, test_id, score, created_at, selected_answers', 
          { count: 'exact' }
        )
        .eq('user_id', exactUser.user_id)
        .order('created_at', { ascending: false })
        .range(
          (currentPage - 1) * ITEMS_PER_PAGE, 
          currentPage * ITEMS_PER_PAGE - 1
        )

      if (results) {
        userResults = await Promise.all(
          results.map(async (result): Promise<AdminTestResult> => {
            try {
              const config = getTestConfig(result.test_id)
              const rule = getResultRule(result.test_id, result.score)
              const personalRecs = getPersonalRecommendations(
                result.test_id,
                (result.selected_answers || []).map((a: { questionId: string; answerId: string }) => ({
                  questionId: a.questionId,
                  answerId: a.answerId
                }))
              )
              
              return {
                ...result,
                test_title: config.title,
                result_rule: {
                  title: rule.title,
                  description: rule.description,
                  recommendations: rule.recommendations
                },
                personalRecommendations: personalRecs
              }
            } catch (error) {
              console.error(`Error processing test ${result.test_id}:`, error)
              return {
                ...result,
                test_title: 'Невідомий тест',
                result_rule: {
                  title: 'Помилка',
                  description: 'Не вдалося завантажити дані тесту',
                  recommendations: []
                },
                personalRecommendations: []
              }
            }
          })
        )
      }
      
      totalResults = count || 0
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Адмін-панель</h1>
        <Link
          href="/admin/add-test"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Створити новий тест
        </Link>
      </div>

      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <form className="space-y-4">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Пошук користувача за email..."
              defaultValue={emailQuery}
              list="user-emails"
              className="w-full p-2 border rounded-lg"
            />
            <datalist id="user-emails">
              {users?.map(user => (
                <option key={user.user_id} value={user.user_email} />
              ))}
            </datalist>
            
            <button
              type="submit"
              className="absolute right-2 top-2 bg-gray-100 px-3 py-1 rounded"
            >
              Знайти
            </button>
          </div>
        </form>

        {selectedUserEmail && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Результати користувача: {selectedUserEmail}
            </h2>

            {userResults.length === 0 ? (
              <p className="text-gray-500">Немає результатів тестів</p>
            ) : (
              <>
                <div className="space-y-4">
                  {userResults.map(result => (
                    <div 
                      key={result.id}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between mb-2">
                        <div>
                          <span className="font-medium">
                            {result.test_title}
                          </span>
                          <span className="text-gray-500 ml-2 text-sm">
                            (ID: {result.test_id})
                          </span>
                        </div>
                        <span className="text-gray-500">
                          {new Date(result.created_at).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Бали: {result.score}
                        </span>
                      </div>

                      <RecommendationsDisclosure 
                        recommendations={result.result_rule.recommendations}
                        title="Загальні рекомендації"
                      />
                      
                      <RecommendationsDisclosure 
                        recommendations={result.personalRecommendations}
                        title="Персональні рекомендації"
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                    searchParams={{ email: emailQuery }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}