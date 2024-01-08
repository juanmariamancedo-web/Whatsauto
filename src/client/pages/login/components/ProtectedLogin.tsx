import { Navigate } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { GET_COUNT_OF_ADMINS, GET_PROFILE } from "../../../graphql/queries"
import Loading from "../../../components/Loading"
import { Cookies } from "../../../utils/cookies"
import usePathnameReturn from "../hooks/usePathnameReturn"

const cookies = Cookies()

export default function ProtectedLogin({complete, children}: {complete:boolean, children: JSX.Element}){
    const resultGetCountOfAdmins = useQuery(GET_COUNT_OF_ADMINS, {fetchPolicy:"network-only"})
    const resultGetProfile = useQuery(GET_PROFILE, {
        context: {
            headers: {
                Authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        fetchPolicy: "network-only"
    })

    const pathname = usePathnameReturn()

    if(complete || (resultGetProfile.data)){
        return <Navigate to={pathname}/>
    }
    
    if(resultGetProfile.loading || resultGetCountOfAdmins.loading) return <Loading />


    if(resultGetCountOfAdmins.data.countOfAdmins == 0){
        return <Navigate to="/singup" />
    }

    return children
}