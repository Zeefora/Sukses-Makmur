import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import POSInput from './POSInput';

const AppRouter = () => {
    const { currentUser, logout } = useAuth();
    const [page, setPage] = useState('login'); // 'login' | 'register'

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
            onLoginSuccess={() => {/* currentUser akan berubah, otomatis ke POS */ }}
        />
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
};

export default App;
