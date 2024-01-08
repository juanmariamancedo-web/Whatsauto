import { Cookies } from "../utils/cookies"
import { Navigate } from "react-router-dom"
import { useState } from "react"

const cookies = Cookies()

export default function LogInOut(){
    const [logOutState, setLogoutState] = useState(false)
    
    function logOut(){
        cookies.deleteCookie("token")
        setLogoutState(true)
    }

    if(logOutState) return <Navigate to={"/login"} />

    return(
        <button onClick={logOut} className="primary-button">
            <span className="material-symbols-outlined align-middle">
                logout
            </span>
        </button>
    )
}