//app/login/actions.tsx
'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function loginWithGoogle() {
  const supabase = await createClient();
  let callbackUrl = 'http://localhost:3000/auth/callback';

if (process.env.NODE_ENV === 'production') {
  callbackUrl = 'https://dp-rosy.vercel.app/auth/callback'; 
}
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  });//

  console.log('auth data: ', data,error)

  if (error) {
    console.error(error);
    redirect('/error');
  }

  if (data.url) {
    redirect(data.url); 
  }
}