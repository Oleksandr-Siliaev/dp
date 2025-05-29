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
  }, [supabase]) 

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-gray-300 shadow-sm w-full">
      {/* Основная обертка с фиксированной максимальной шириной */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center">
          <Link 
            href="/" 
            className="text-xl font-bold text-black md:mr-4"
          >
            Тести
          </Link>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4 md:gap-6">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="text-black hover:text-blue-500 hidden md:block"
                  >
                    Адмінка
                  </Link>
                )}
                
                <Link 
                  href="/profile" 
                  className="text-black hover:text-blue-500"
                >
                  Профіль
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="text-black hover:text-red-500"
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link href="/login" className="text-black hover:text-blue-500">
                Увійти
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}