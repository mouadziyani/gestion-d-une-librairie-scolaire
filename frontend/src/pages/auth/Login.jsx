import React, {useState} from "react";

function Login(){
    return(
        <div>
            <div>Login to Library Bougdim</div>
            <div>
                img
            </div>
            <div>
                <form action="#">
                    <div>Welcome Again</div>
                    <div>
                        <label htmlFor="">UserName</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input type="password" />
                    </div>
                    <div>
                        <button>Login</button>
                    </div>
                    <div>
                        You don't have account <a href="./Register.jsx">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;