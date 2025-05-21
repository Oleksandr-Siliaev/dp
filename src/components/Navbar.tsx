// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function Navbar() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
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
        
        {/* Поисковая строка */}
        <form 
          onSubmit={handleSearch}
          className="flex-1 w-full md:max-w-xl mx-4"
        >
          <input
            type="text"
            placeholder="Поиск по названию теста..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex space-x-4">
          {user ? (
            <>
              <Link href="/profile" className="hover:text-blue-500">
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