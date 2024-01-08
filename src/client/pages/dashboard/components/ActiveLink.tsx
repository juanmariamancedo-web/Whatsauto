import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export function ActiveLink({children, className , activeClassName, to}: {children: string, className: string, activeClassName: string, to:string}){
    const pathname = useLocation().pathname

    const [computedClasName, setComputedClassName] = useState(className)

    useEffect(()=>{
        to == pathname? setComputedClassName(`${className? className : ""} ${activeClassName}`.trim()): setComputedClassName(className)
    }, [pathname])

    return(
        <Link to={to} className={computedClasName}>
            {children}
        </Link>
    )
}