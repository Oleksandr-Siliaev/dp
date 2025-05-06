//auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/profile'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error('Ошибка получения пользователя:', userError)
          return NextResponse.redirect(`${origin}/error`)
        }

        // Проверяем существование профиля
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (countError) {
          console.error('Ошибка проверки профиля:', countError)
          return NextResponse.redirect(`${origin}/error`)
        }

        // Создаем профиль если не существует
        if (count === 0) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              user_email: user.email!,
              user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Пользователь'
            })

          if (insertError) {
            console.error('Ошибка создания профиля:', insertError)
            return NextResponse.redirect(`${origin}/error`)
          }
        }

        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('Общая ошибка:', err)
    }
  }

  return NextResponse.redirect(`${origin}/error`)
}