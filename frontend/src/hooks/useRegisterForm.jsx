import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRoleHomePath } from "../utils/helpers";

function getErrorMessage(err, fallback) {
    if (typeof err === "string") {
        return err;
    }

    if (err?.errors) {
        return Object.values(err.errors).flat().join(' ');
    }

    return err?.message || fallback;
}

function useRegisterForm() {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);
    const [Form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState('');

    function handleChange(e) {
        setForm({ ...Form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (Form.password !== Form.password_confirmation) {
            setError("Passwords don't match.");
            return;
        }

        try {
            const response = await register(Form);
            const roleSlug = response?.data?.user?.role?.slug || response?.data?.data?.user?.role?.slug;
            navigate(getRoleHomePath(roleSlug));
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed.'));
            console.error("Erreur : ", err);
        }
    }

    return { Form, handleChange, handleSubmit, error };
}

export default useRegisterForm;
