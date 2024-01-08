import { useEffect} from "react"
import { useSelector, useDispatch } from 'react-redux'
import { changeTheme } from "../redux/theme"
import { ReduxState } from "../../models/Redux"

export default function ButtonOfDarkMode(){
    const theme = useSelector((state:ReduxState) => state.theme.theme)
    const dispatch = useDispatch()
   
    useEffect(()=>{
        if(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
            document.body.classList.add("dark")
            localStorage.theme = "dark"
            dispatch(changeTheme("dark"))
        }else{
            document.body.classList.remove("dark")
            localStorage.theme = "light"
            dispatch(changeTheme("light"))
        }

    }, [])

    function changeThemeMode(){
        if(theme == "dark"){
            document.body.classList.remove("dark")
            localStorage.theme = "light"
            dispatch(changeTheme("light"))
        }else{
            document.body.classList.add("dark")
            localStorage.theme = "dark"
            dispatch(changeTheme("dark"))
        }
    }

    return(
        <button onClick={changeThemeMode} className="primary-button">
            <span className="material-symbols-outlined align-middle">
                {theme == "dark"? "light_mode" : "dark_mode"}
            </span>
        </button>
    )
}