import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useLogin from "./hooks/useLogin";
import ProtectedLogin from "./components/ProtectedLogin";
import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

export default function Login(){
    const [username, setUsername ] = useState("")
    const [password, setPassword] = useState("")
    const {login, complete, errorLogin} = useLogin(username, password)

    useTitle("Login")
    
    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        login({
            variables: {
                emailOrUsername: username,
                password
            },
            fetchPolicy: "network-only"
        })
    }

    return(
        <ProtectedLogin complete={complete}>  
            <div className="flex justify-center items-center">
                <form className="p-3 rounded-2xl shadow-xl flex flex-col items-center gap-3" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-3">
                        <span className="font-bold">Username</span>
                        <input type="text" className="rounded-xl px-2" value={username} onChange={(e:ChangeEvent<HTMLInputElement>)=> setUsername(e.target.value)}/>
                    </label>
                    <label className="flex flex-col gap-3">
                        <span className="font-bold">Password</span>
                        <input type="password" value={password} onChange={(e:ChangeEvent<HTMLInputElement>)=> setPassword(e.target.value)} className="rounded-xl px-2"/>
                        <Link to="/i-forgot-my-password" className="underline dark:text-white">I forgot my password</Link>
                    </label>
                    {errorLogin? (<p className="py-1 px-2 text-red-500 bg-white rounded-2xl shadow-xl border-red-500 border-2">
                        The username or password is incorrect
                    </p>): null}
                    <input type="submit" className="primary-button" value="Login" />
                </form>
            </div>
        </ProtectedLogin>
    )
}
