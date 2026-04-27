import { api } from "@/shared/services/api";

export async function registerUser(data) {
    try {
        const response = await api.post('/register' , data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function loginUser(data) {
    try {
        const response = await api.post('/login' , data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
