import { useMutation } from "@apollo/client"
import { LOGIN } from "../../../graphql/mutations"
import { useEffect, useState } from "react"
import { Cookies } from "../../../utils/cookies"

const cookies = Cookies()

export default function useLogin(username:string, password:string){
    const [login, {data, error}] = useMutation(LOGIN)
    const [complete, setComplete] = useState(false)
    const [errorLogin, setErrorLogin] = useState(false)

    useEffect(()=>{
        setErrorLogin(false)
    }, [username, password])

    useEffect(()=>{
        if(error) setErrorLogin(true)
        if(data && data.login) {
            cookies.setCookie("token", data.login, 30)
            setComplete(true)
        }
    }, [data, error])

    return ({
        login,
        complete,
        errorLogin
    })
}