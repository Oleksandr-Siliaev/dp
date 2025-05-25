// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { ProfileData } from '@/types'

export function Navbar() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id, user_email, user_name, role')
          .eq('user_id', user.id)
          .single()
        
        if (profileData) {
          setProfile({
            user_id: profileData.user_id,
            user_email: profileData.user_email,
            user_name: profileData.user_name,
            role: profileData.role
          })
        }
      }
    }
    
    checkAuth()
  }, [supabase]) // Добавили supabase в зависимости

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

 return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row gap-4 md:gap-0 items-center">
        <Link href="/" className="text-xl font-bold md:mr-4 text-black">Тесты</Link>

        <div className="flex-1"></div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-black hover:text-blue-500 hidden md:block"
                >
                  Админка
                </Link>
              )}
              
              <Link 
                href="/profile" 
                className="text-black hover:text-blue-500"
              >
                Профиль
              </Link>
              
              <button 
                onClick={handleLogout}
                className="text-black hover:text-red-500"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link href="/login" className="text-black hover:text-blue-500">
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}