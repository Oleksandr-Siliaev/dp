'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
    },
  });

  console.log('auth data: ', data,error)

  if (error) {
    console.error(error);
    redirect('/error');
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}