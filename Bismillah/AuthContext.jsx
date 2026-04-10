import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Default demo user agar bisa langsung dicoba
const DEFAULT_USERS = [
    {
        id: 1,
        namaVendor: 'Toko Sukses Makmur',
        email: 'admin@suksesmakmur.id',
        password: 'Admin123',
        telepon: '081234567890',
        alamat: 'Jl. Raya Berkah No. 1, Jakarta',
        kategori: 'Sembako',
        createdAt: new Date().toISOString(),
    }
];

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('sm_currentUser');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    const [registeredUsers, setRegisteredUsers] = useState(() => {
        try {
            const saved = localStorage.getItem('sm_registeredUsers');
            return saved ? JSON.parse(saved) : DEFAULT_USERS;
        } catch { return DEFAULT_USERS; }
    });

    // Persist ke localStorage
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('sm_currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('sm_currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('sm_registeredUsers', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    const login = (email, password) => {
        const user = registeredUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) {
            return { success: false, error: 'Email atau password salah. Silakan coba lagi.' };
        }
        setCurrentUser(user);
        return { success: true, user };
    };

    const register = (formData) => {
        const emailExists = registeredUsers.some(
            u => u.email.toLowerCase() === formData.email.toLowerCase()
        );
        if (emailExists) {
            return { success: false, error: 'Email sudah terdaftar. Silakan gunakan email lain.' };
        }
        const newUser = {
            id: Date.now(),
            namaVendor: formData.namaVendor,
            email: formData.email,
            password: formData.password,
            telepon: formData.telepon,
            alamat: formData.alamat,
            kategori: formData.kategori,
            createdAt: new Date().toISOString(),
        };
        setRegisteredUsers(prev => [...prev, newUser]);
        return { success: true, user: newUser };
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, registeredUsers, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
    return context;
};

export default AuthContext;
