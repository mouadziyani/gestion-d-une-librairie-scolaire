import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form } from "react-router-dom";

function useRegisterForm(){

    const {register} = useContext(AuthContext);
    const [Form , setForm] = useState({
        name: '',
        email: '' ,
        password: '',
        confirmed_password: '',
        role: '',
    });

    function handleChange(e){
        setForm({...Form, [e.target.name]:e.target.value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            await register(Form);
        }catch(err){
            console.error("Erreur : ", err);
        }
    }

    return {Form , handleChange , handleSubmit};

}
export default useRegisterForm;