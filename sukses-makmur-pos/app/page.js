'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import POSInput from './components/POSInput';

function AppRouter() {
  const { currentUser, logout, isHydrated } = useAuth();
  const [page, setPage] = useState('login');

  // Tunggu hydration selesai agar tidak flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-900">
        <div className="text-center animate-pulse">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/30 mb-4">
            <span className="text-3xl font-bold text-emerald-950">SM</span>
          </div>
          <p className="text-emerald-300/50 text-sm font-medium tracking-wider uppercase">Memuat...</p>
        </div>
      </div>
    );
  }

  // Jika sudah login → langsung ke POS Dashboard
  if (currentUser) {
    return <POSInput onLogout={logout} />;
  }

  // Belum login → tampilkan Login atau Register
  if (page === 'register') {
    return (
      <Register
        onNavigateLogin={() => setPage('login')}
        onRegisterSuccess={() => setPage('login')}
      />
    );
  }

  return (
    <Login
      onNavigateRegister={() => setPage('register')}
      onLoginSuccess={() => { }}
    />
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
