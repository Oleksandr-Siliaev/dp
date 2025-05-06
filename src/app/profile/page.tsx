// app/profile/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TESTS } from '@/data/tests'
interface ProfileData {
  user_id: string
  user_email: string
  user_name: string
}

interface TestResult {
  id: string
  result_text: string
  created_at: string
  test_name: string | null
}

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // Аутентификация
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  // Получение профиля
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_email, user_name')
    .eq('user_id', user.id)
    .single()

  if (profileError) redirect('/error')

  // Запрос результатов с явным JOIN
  const { data: results, error: resultsError } = await supabase
    .from('test_results')
    .select(`
      id,
      result_text,
      created_at,
      test_id 
    `)
    .eq('user_id', user.id)
      console.log('Results:', results)
  if (resultsError) redirect('/error')

  // Преобразование результатов
  const formattedResults: TestResult[] = (results || []).map(result => ({
    id: result.id,
    result_text: result.result_text,
    created_at: result.created_at,
    test_name: TESTS.find (t => t.id === result.test_id)?.title || null
  }))

  return (
    <div className="container mx-auto p-4">
      {/* Секция профиля */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold mb-4">Ваш профиль</h1>
        <div className="space-y-2">
          <p><span className="font-semibold">Имя:</span> {profile.user_name || 'Не указано'}</p>
          <p><span className="font-semibold">Email:</span> {profile.user_email}</p>
        </div>
      </div>

      {/* Секция результатов */}
      <div>
        <h2 className="text-xl font-bold mb-4">История тестов</h2>
        
        {formattedResults.length > 0 ? (
          formattedResults.map((result) => (
            <div key={result.id} className="border p-4 rounded-lg mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {result.test_name || 'Неизвестный тест'}
                  </h3>
                  <p className="text-gray-600 mt-2">{result.result_text}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(result.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Вы еще не прошли ни одного теста</p>
        )}
      </div>
    </div>
  )
}