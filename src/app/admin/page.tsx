// app/admin/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <Link
          href="/admin/add-test"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Создать новый тест
        </Link>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-700">
          Текущая роль: <span className="font-semibold">{profile.role}</span>
        </p>
      </div>
    </div>
  )
}