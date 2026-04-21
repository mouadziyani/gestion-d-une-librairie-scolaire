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

function useLoginForm() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [Form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    function handleChange(e) {
        setForm({ ...Form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const response = await login(Form);
            const roleSlug = response?.data?.user?.role?.slug || response?.data?.data?.user?.role?.slug;
            navigate(getRoleHomePath(roleSlug));
        } catch (err) {
            setError(getErrorMessage(err, 'Login failed.'));
            console.error("Erreur : ", err);
        }
    }

    return { Form, handleChange, handleSubmit, error };
}

export default useLoginForm;
