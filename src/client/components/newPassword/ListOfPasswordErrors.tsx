import { useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react"

interface props {
    password:string
    enableVisible:boolean,
    setError: Dispatch<SetStateAction<boolean>>,
}

const mayus = /[A-Z]/;
const lower = /[a-z]/;
const num = /\d/
const specials = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

export function ListOfPasswordError({password, enableVisible, setError}:props){ 
    const [visible, setVisible] = useState(false)
     
    const [mayusError, setMayusError] = useState(true)
    const [lowerError, setLowerError]= useState(true)
    const [numError, setNumError]= useState(true)
    const [specialsError, setSpecialsError] = useState(true)
    const [lenghtError, setLenghtError] = useState(true)

    useEffect(()=>{
        !mayus.test(password)? setMayusError(true): setMayusError(false)
        !lower.test(password)? setLowerError(true): setLowerError(false)
        !num.test(password)? setNumError(true): setNumError(false)
        !specials.test(password)? setSpecialsError(true): setSpecialsError(false)
        password.length < 8? setLenghtError(true):setLenghtError(false)
    }, [password])

    useEffect(()=>{
        if(!(mayusError || lowerError || numError || specialsError || lenghtError)){
            setVisible(false)
            setError(false)
        }else{
            setVisible(true)
            setError(true)
        }
    }, [mayusError, lowerError, numError, specialsError, lenghtError, setVisible])

    return(
        <div className="overflow-hidden">
            <ul className={`${enableVisible && visible? "": "-mb-[100%]"}  relative transition-all duration-1000 ease-linear`}>
                <ItemError error={mayusError}>
                    a capital letter
                </ItemError>
                <ItemError error={lowerError}>
                    a lowercase letter
                </ItemError>
                <ItemError error={numError}>
                    a number
                </ItemError>
                <ItemError error={specialsError}>
                    a special letter
                </ItemError>
                <ItemError error={lenghtError}>
                    8 characters minimum
                </ItemError>
            </ul>
        </div>
    )
}

function ItemError({error, children}: {error:boolean, children:ReactNode}){
    return(
        <li>
            {error? <span className="font-icon text-red-600 align-middle font-bold">close</span>:<span className="font-icon text-yellow-300 align-middle font-bold">done</span>} {children}
        </li>
    )
}