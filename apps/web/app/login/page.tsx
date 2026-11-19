'use client';

import React, { Suspense } from 'react';
import { SplitAuth } from '@simplifypdf/ui';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const plan = searchParams?.get('plan');

  const handleLogin = (email: string) => {
    window.location.href = 'http://localhost:3001';
  };

  return (
    <div className="py-8 px-4 flex items-center justify-center">
      <SplitAuth
        onSubmitEmail={(email, password) => handleLogin(email)}
        onGoogleSignIn={() => handleLogin('google@user.com')}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
