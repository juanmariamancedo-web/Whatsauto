import { useLazyQuery, useQuery } from "@apollo/client"
import { GET_COUNT_OF_ADMINS, GET_PROFILE } from "../../../graphql/queries"
import { Navigate } from "react-router-dom"
import { Cookies } from "../../../utils/cookies"
import Loading from "../../../components/Loading"

const cookies = Cookies()

export default function ProtectedSingUp({children}: {children: JSX.Element}){
    const resultGetCountOfAdmins = useQuery(GET_COUNT_OF_ADMINS,{fetchPolicy: 'network-only'})
    const resultGetProfile = useQuery(GET_PROFILE, {
        context: {
            headers: {
                authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        fetchPolicy: 'network-only'
    })

    if(resultGetProfile.data) return <Navigate to={"/"} />
    
    if(resultGetCountOfAdmins.loading || resultGetProfile.loading) return <Loading />

    if(resultGetCountOfAdmins.data.countOfAdmins > 0) return <Navigate to={"/login"} />

    return children
}