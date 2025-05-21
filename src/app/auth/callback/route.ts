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
          console.error('Помилка отримання користувача:', userError)
          return NextResponse.redirect(`${origin}/error`)
        }

        // Проверяем существование профиля
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (countError) {
          console.error('Помилка перевірки профілю:', countError)
          return NextResponse.redirect(`${origin}/error`)
        }

        // Создаем профиль если не существует
        if (count === 0) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              user_email: user.email!,
              user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Користувач',
               role: 'user'
            })

          if (insertError) {
            console.error('Помилка створення профілю:', insertError)
            return NextResponse.redirect(`${origin}/error`)
          }
        }

        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('Загальна помилка:', err)
    }
  }

  return NextResponse.redirect(`${origin}/error`)
}