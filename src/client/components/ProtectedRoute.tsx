import { useQuery } from "@apollo/client";
import { Navigate, useLocation} from "react-router-dom";
import { GET_PROFILE } from "../graphql/queries";
import { Cookies } from "../utils/cookies";
import Loading from "./Loading";

const cookies = Cookies()

export default function ProtectedRoute({children}: {children: JSX.Element}){
    const {pathname} = useLocation()

    const {loading, error} = useQuery(GET_PROFILE, {
        context: {
            headers: {
                authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        fetchPolicy: 'network-only'
    })

    if(error) return(
        <Navigate to={"/login"} state={pathname}/>
    )

    if(loading) return <Loading />

    return children
}
