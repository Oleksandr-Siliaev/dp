'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function Navbar() {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Тесты</Link>
        
        <div className="space-x-4">
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