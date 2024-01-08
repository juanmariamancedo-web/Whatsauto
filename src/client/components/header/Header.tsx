import HeaderCheckAuthentication from "./HeaderCheckAuthentication";
import ButtonOfDarkMode from "../ButtonOfDarkMode";
import { Link } from "react-router-dom";

import { useEffect, useState} from "react"

export default function Header(){
    const [open, setOpen] = useState(false)
    
    useEffect(()=>{
        const mql = window.matchMedia("(min-width: 1024px)");
        mql.onchange = (e) => {
            if(!(e.matches)) setOpen(false)
        }
    }, [])

    function toggleOpen(){
        setOpen((prevState)=> !prevState)
    }

    return (
        <header className="z-10 fixed w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-900 dark:to-blue-900 dark:text-white flex justify-center items-center">
            <nav className="w-full h-full relative">
                <div className="absolute inset-0 flex justify-center items-center">
                    <div className="container p-3 flex justify-center lg:justify-start items-center">
                        <Link className="text-3xl font-mono z-30" to="/">WhatsAuto</Link>
                    </div>
                </div>
                <div className="absolute inset-0 flex justify-center items-center lg:hidden">
                    <div className="container p-3">
                        <button onClick={toggleOpen}>
                            <span className="material-symbols-outlined">
                                {open? "close": "menu"}
                            </span>
                        </button>
                    </div>
                </div>
                <div className={`${open? "translate-x-full": ""} bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-900 dark:to-blue-900 z-20 fixed inset-y-0 -left-full right-full transition-transform duration-1000 lg:z-auto lg:bg-transparent lg:transition-none lg:absolute lg:inset-0`}>
                    <div className="obsolute w-full h-14 flex justify-center items-center lg:hidden">
                        <div className="container p-3 flex items-center">
                            <button onClick={toggleOpen} className="z-10">
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center">
                        <div className="container p-3 flex justify-center flex-col lg:flex-row lg:justify-end items-center gap-3">
                            <ul className="flex flex-col lg:flex-row gap-3">
                                <li className="order-3">
                                    <ButtonOfDarkMode />
                                </li>
                                <HeaderCheckAuthentication />
                            </ul>
                        </div>
                    </div>
                </div>  
            </nav>
        </header>
    )
}

/*export default function Header(){
    return(
        <header className="p-3 flex justify-between gap-3">
            <span className="font-mono text-3xl">
                WhatsAuto
            </span>
            <nav>
                <ul className="flex justify-between gap-3">
                    <li className="bg-white py-2 px-3 rounded-xl">
                        <Link to={"/login"}>login</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}*/