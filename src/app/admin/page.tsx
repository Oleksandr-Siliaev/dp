// app/admin/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
      <h1 className="text-2xl font-bold mb-4">Админ-панель</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p>Текущая роль: {profile.role}</p>
      </div>
    </div>
  )
}