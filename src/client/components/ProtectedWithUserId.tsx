import { Navigate, useSearchParams } from "react-router-dom"
import { GET_USER } from "../graphql/queries"
import { useQuery } from "@apollo/client"
import { Cookies } from "../utils/cookies"
import { Outlet } from "react-router-dom"
import Loading from "./Loading"

const cookies = Cookies()

export default function ProtectedWithUserId(){
    const [searchParams] = useSearchParams()

    const {loading, error} = useQuery(GET_USER, {
        context: {
            headers: {
                authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        variables: {
            userId: parseInt(searchParams.get("userId") || "")
        },
        fetchPolicy: 'network-only'
    })

    if(loading) return <Loading />

    if(!searchParams.get("userId") || error) return <Navigate to="/dashboard/users" />

    return <Outlet />
}