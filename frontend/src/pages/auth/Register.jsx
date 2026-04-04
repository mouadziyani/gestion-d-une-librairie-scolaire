import React, {useState} from "react";

function Register(){
    return(
        <div>
            <div>Register to Library Bougdim</div>
            <div>
                img
            </div>
            <div>
                <form action="#">
                    <div>Welcome to our site</div>
                    <div>
                    <div>
                        <label htmlFor="">First name</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label htmlFor="">Last Name</label>
                        <input type="text" name="" id="" />
                    </div>
                    </div>
                    <div>
                        <label htmlFor="">Email</label>
                        <input type="email" />
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input type="password" />
                    </div>
                    <div>
                        <label htmlFor="">Confirm Password</label>
                        <input type="password" />
                    </div>
                    <div>
                        <button>Login</button>
                    </div>
                    <div>
                        You have account <a href="./Login.jsx">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Register;