import { useState } from 'react';
import * as authServices from '../services/authService'
import { AuthContext } from './AuthContext';

function AuthProvider({children}) {
    const [user , setUser] = useState(null);

    async function register(Form) {
        try {
            const res = await authServices.registerUser(Form);

            const { user, token } = res;

            localStorage.setItem("token", token);

            setUser(user);

            return res;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    async function login(Form) {
        try {
            const res = await authServices.loginUser(Form);

            const {user, token} = res.data;

            localStorage.setItem("token" , token);

            setUser(user);

            return res;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    return (
        <AuthContext.Provider value={{user , register , login}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;