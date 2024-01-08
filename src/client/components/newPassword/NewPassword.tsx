import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { ListOfPasswordError } from "./ListOfPasswordErrors"
import { MatchPassword } from "./MatchPassword"

interface props {
    password: string
    setPassword:Dispatch<SetStateAction<string>>,
    setApproved:Dispatch<SetStateAction<boolean>> 
}

export default function NewPassword({password, setPassword, setApproved}:  props){
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [enableVisibleErrors, setEnableVisibleErrors] = useState(false)
    const [enableVisibleMatchPassword, setEnableVisibleMatchPassword] = useState(false)
    const [error, setError] = useState(true)
    const [matchPassword, setMatchPassword] = useState(false)

    function handleChangePassword(event:ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value.replaceAll(" ", ""))
    }

    useEffect(()=>{
        if(!error && matchPassword) {
            setApproved(true)
        }else{
            setApproved(false)
        }
    }, [matchPassword, error])

    return(
        <>
            <label className="flex flex-col dark:text-white">
                Password
                <input type="password" value={password} onChange={handleChangePassword} onFocus={()=>setEnableVisibleErrors(true)} className="p-1 rounded-xl dark:text-black" />
            </label>
            <ListOfPasswordError password={password} enableVisible={enableVisibleErrors} setError={setError}/>
            <label className="flex flex-col dark:text-white">
                Repeat Password
                <input type="password" value={passwordRepeat} onChange={(e)=>{setPasswordRepeat(e.target.value)}} onFocus={()=>setEnableVisibleMatchPassword(true)} className="p-1 rounded-xl dark:text-black" />
            </label>
            <MatchPassword enableVisible={enableVisibleMatchPassword} password={password} repeatPassword={passwordRepeat} matchPassword={matchPassword} setMatchPassword={setMatchPassword}/>
        </>
    )
}