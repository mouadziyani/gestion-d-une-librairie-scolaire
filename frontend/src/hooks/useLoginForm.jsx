import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form } from "react-router-dom";

function useLoginForm(){

    const {login} = useContext(AuthContext);
    const [Form , setForm] = useState({
        email: '' ,
        password: '',
    });

    function handleChange(e){
        setForm({...Form, [e.target.name]:e.target.value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            await login(Form);
        }catch(err){
            console.error("Erreur : ", err);
        }
    }

    return {Form , handleChange , handleSubmit}

}
export default useLoginForm;