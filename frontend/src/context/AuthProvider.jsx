import { useEffect, useState } from 'react';
import * as authServices from '../services/authService';
import { AuthContext } from './AuthContext';
import { api } from '../services/api';

const AUTH_USER_KEY = 'auth_user';

function readCachedUser() {
    try {
        const cached = localStorage.getItem(AUTH_USER_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
}

function storeCachedUser(user) {
    if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return;
    }

    localStorage.removeItem(AUTH_USER_KEY);
}

function readAuthPayload(response) {
    return response?.data ?? response ?? {};
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => readCachedUser());
    const [loading, setLoading] = useState(() => {
        const token = localStorage.getItem('token');
        const cachedUser = readCachedUser();
        const hasCachedRole = Boolean(cachedUser?.role?.slug);
        return Boolean(token && !hasCachedRole);
    });

    async function me() {
        const res = await api.get('/me');
        const currentUser = res.data?.data?.user ?? null;

        setUser(currentUser);
        storeCachedUser(currentUser);
        return currentUser;
    }

    async function updateProfile(data) {
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        if (isFormData && !data.has('_method')) {
            data.append('_method', 'PUT');
        }

        const res = isFormData
            ? await api.post('/profile', data)
            : await api.put('/profile', data);
        const updatedUser = res.data?.data?.user ?? null;

        setUser(updatedUser);
        storeCachedUser(updatedUser);
        return res.data;
    }

    async function register(Form) {
        try {
            const res = await authServices.registerUser(Form);
            const { user, token } = readAuthPayload(res);

            localStorage.setItem('token', token);
            setUser(user);
            storeCachedUser(user);

            return res;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async function login(Form) {
        try {
            const res = await authServices.loginUser(Form);
            const { user, token } = readAuthPayload(res);

            localStorage.setItem('token', token);
            setUser(user);
            storeCachedUser(user);

            return res;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async function logout() {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            storeCachedUser(null);
        }
    }

    async function deleteProfile() {
        try {
            await api.delete('/profile');
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            storeCachedUser(null);
        }
    }

    useEffect(() => {
        function handleUnauthenticated() {
            localStorage.removeItem('token');
            setUser(null);
            storeCachedUser(null);
            setLoading(false);
        }

        window.addEventListener('auth:unauthenticated', handleUnauthenticated);

        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return () => {
                window.removeEventListener('auth:unauthenticated', handleUnauthenticated);
            };
        }

        const cachedUser = readCachedUser();

        if (cachedUser?.role?.slug) {
            setUser(cachedUser);
            setLoading(false);
        } else if (cachedUser) {
            setUser(cachedUser);
            setLoading(true);
        }

        me()
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
                storeCachedUser(null);
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            window.removeEventListener('auth:unauthenticated', handleUnauthenticated);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, deleteProfile, me, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
