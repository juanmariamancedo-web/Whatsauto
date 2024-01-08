import { useLocation } from "react-router-dom"

export default function usePathnameReturn():string{
    const {state} = useLocation()

    return state? state : "/"
}