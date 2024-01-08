import { useState, useEffect } from "react"

export default function SwitchOpen({children, setOpen}: {children: JSX.Element, setOpen: React.Dispatch<React.SetStateAction<boolean>>}){
    useEffect(()=>{
        const mql = window.matchMedia("(min-width: 1024px)")

        function listenner(x:any){
            x.matches? setSmall(false) : setSmall(true)
        }

        listenner(mql)

        mql.onchange = listenner
    }, [])

    const [small, setSmall] = useState(false)

    return (
    <button onClick={()=>{
        if(small) setOpen(false)
    }}>
        {children}
    </button>)
}