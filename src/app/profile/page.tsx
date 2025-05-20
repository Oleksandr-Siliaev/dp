// app/profile/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTestConfig, getResultRule } from '@/lib/test-results'

interface ProfileData {
  user_id: string
  user_email: string
  user_name: string
}

interface TestResult {
  id: string
  test_id: string
  score: number
  created_at: string
  test_title: string
  result_rule: {
    title: string
    description: string
    recommendations: string[]
  }
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

  // Запрос результатов тестов
  const { data: results, error: resultsError } = await supabase
    .from('test_results')
    .select('id, test_id, score, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (resultsError) redirect('/error')

  // Обработка и преобразование результатов
  const formattedResults = results?.map(result => {
    try {
      const config = getTestConfig(result.test_id)
      const rule = getResultRule(result.test_id, result.score)
      
      return {
        id: result.id,
        test_id: result.test_id,
        score: result.score,
        created_at: result.created_at,
        test_title: config.title,
        result_rule: {
          title: rule.title,
          description: rule.description,
          recommendations: rule.recommendations
        }
      }
    } catch (error) {
      // Если тест не найден в конфигах
      return {
        id: result.id,
        test_id: result.test_id,
        score: result.score,
        created_at: result.created_at,
        test_title: 'Неизвестный тест',
        result_rule: {
          title: 'Результат недоступен',
          description: 'Информация о тесте устарела',
          recommendations: []
        }
      }
    }
  }) || []

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
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {result.test_title}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({result.score} баллов)
                    </span>
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(result.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-medium text-gray-800">
                  {result.result_rule.title}
                </h4>
                <p className="text-gray-600 mt-1">
                  {result.result_rule.description}
                </p>
              </div>

              {result.result_rule.recommendations.length > 0 && (
                <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Рекомендации:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.result_rule.recommendations.map((rec, i) => (
                      <li 
                        key={i} 
                        className="text-blue-700 text-sm"
                      >
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Вы еще не прошли ни одного теста
            </p>
          </div>
        )}
      </div>
    </div>
  )
}