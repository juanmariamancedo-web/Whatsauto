import { User } from "../../../../models/users"
import { Cookies } from "../../../utils/cookies"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { ActiveLink } from "./ActiveLink"
import { ImageAvatar } from "../../profile/change-avatar/components/ImageAvatar"
import { ReduxState } from "../../../../models/Redux"
import ButtonOfDarkMode from "../../../components/ButtonOfDarkMode"
import SwitchOpen from "./SwitchOpen"
import LogInOut from "../../../components/LogInOut"

const cookies = Cookies()

export default function Menu({profile}: {profile: User}){
    const [open, setOpen] = useState(true)
    const isADMIN = profile.role == "ADMIN"? true: false
    const router = useNavigate()

    //avatar
    const [style, setStyle] = useState(profile.avatar.style)
    const [seed, setSeed] = useState(profile.avatar.seed)
    const styleRedux = useSelector((state:ReduxState) => state.avatar.style)
    const seedRedux = useSelector((state:ReduxState) => state.avatar.seed)

    useEffect(()=>{
        if(styleRedux) setStyle(styleRedux)
        if(seedRedux) setSeed(seedRedux)
    }, [styleRedux, seedRedux, style, seed])

    useEffect(()=>{
        const mql = window.matchMedia("(min-width: 1024px)")

        function listenner(x:any){
            x.matches? setOpen(true) : setOpen(false)
        }

        listenner(mql)

        mql.onchange = listenner
    }, [])

    function handleClick(){
        setOpen((prev)=>!prev)
    }

    return(
        <>
            <button className="block lg:hidden fixed top-3 left-3 z-20 text-black dark:text-white" onClick={handleClick}>
                <span className="material-symbols-outlined">
                    {open? "close": "menu"}
                </span>
            </button>
            <nav className={`${!open? "-translate-x-full": null} z-10 transition-transform lg:transition-none duration-1000 fixed min-h-screen w-full md:w-96 lg:w-1/4 flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-900 dark:to-blue-900 dark:text-white`}>
                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    <div className="container p-3 flex justify-center items-center">
                        <Link className="text-3xl font-mono z-30" to="/">WhatsAuto</Link>
                    </div>
                    <div className="flex flex-col gap-3 items-start">
                        <SwitchOpen setOpen={setOpen}>
                            <Link to="/dashboard/profile">
                                <ImageAvatar size={32} style={style} seed={seed} />
                            </Link>
                        </SwitchOpen>
                        <LogInOut />
                        <ButtonOfDarkMode />
                    </div>
                </div>
                <div className="absolute left-0 right-0 p-3 flex flex-col items-center gap-3">
                    <p className="text-3xl font-mono text-center">
                        Collections
                    </p>
                    <ul className="text-lg flex flex-col items-center">
                        <li>
                        <SwitchOpen setOpen={setOpen}>
                            <ActiveLink to="/" className="transition-all duration-1000" activeClassName="underline decoration-wavy font-bold">
                                Surveys
                            </ActiveLink>
                        </SwitchOpen>
                        </li>
                        {isADMIN? (
                            <li>
                                <SwitchOpen setOpen={setOpen}>
                                    <ActiveLink to="/dashboard/users" className="transition-all duration-1000" activeClassName="underline decoration-wavy font-bold">
                                        Users
                                    </ActiveLink>    
                                </SwitchOpen>
                            </li>
                        ): null}
                    </ul>
                </div>
            </nav>
        </>
    )
}