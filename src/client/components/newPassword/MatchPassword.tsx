import { useEffect, Dispatch, SetStateAction } from "react"

interface props {
    enableVisible: boolean,
    password: string
    repeatPassword: string,
    setMatchPassword: Dispatch<SetStateAction<boolean>>,
    matchPassword: boolean
}

export function MatchPassword({enableVisible, password, repeatPassword, matchPassword, setMatchPassword} : props){
    useEffect(()=>{
        if(password == repeatPassword){
            setMatchPassword(true)
        }else{
            setMatchPassword(false)
        }
    }, [password, repeatPassword])

    return(
        <div className="overflow-hidden">
            <p className={`${enableVisible && !matchPassword? "": "-mb-[100%]"}  relative transition-all duration-1000 ease-linear`}>
                password dont match
            </p>
        </div>
    )
}