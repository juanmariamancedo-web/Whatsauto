import { Navigate } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { GET_PROFILE } from "../../../graphql/queries"
import Loading from "../../../components/Loading"
import { Cookies } from "../../../utils/cookies"

const cookies = Cookies()

export default function ProtectedReceiveTokenForCreateUser({children}: {children: JSX.Element}){
    const resultGetProfile = useQuery(GET_PROFILE, {
        context: {
            headers: {
                Authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        fetchPolicy: "network-only"
    })

    if(resultGetProfile.data){
        return <Navigate to="/dashboard/profile"/>
    }
    
    if(resultGetProfile.loading) return <Loading />

    return children
}