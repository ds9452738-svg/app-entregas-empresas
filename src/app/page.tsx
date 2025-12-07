"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!authService.isLogado()) {
      router.push('/login');
    } else {
      // Redirecionar para dashboard se já estiver logado
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Carregando...</p>
      </div>
    </div>
  );
}
