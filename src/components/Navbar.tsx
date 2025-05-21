// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { ProfileData } from '@/types'

export function Navbar() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
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
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?search=${encodeURIComponent(searchQuery)}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row gap-4 md:gap-0 items-center">
        <Link href="/" className="text-xl font-bold md:mr-4">Тесты</Link>
        
        <form 
          onSubmit={handleSearch}
          className="flex-1 w-full md:max-w-xl mx-4"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по названию теста..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="hover:text-blue-500 hidden md:block"
                >
                  Админка
                </Link>
              )}
              
              <Link 
                href="/profile" 
                className="hover:text-blue-500"
              >
                Профиль
              </Link>
              
              <button 
                onClick={handleLogout}
                className="hover:text-red-500"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-blue-500">
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}