import { useQuery } from "@apollo/client";
import { GET_COUNT_OF_ADMINS, GET_PROFILE } from "../../../graphql/queries";
import { Navigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import { Cookies } from "../../../utils/cookies";

const cookies = Cookies()

export default function ProtectedIForgotMyPassword({children}: {children: JSX.Element}){
    const resultGetCountOfAdmins = useQuery(GET_COUNT_OF_ADMINS)
    const resultGetProfile = useQuery(GET_PROFILE, {
        context: {
            headers: {
                Authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        fetchPolicy: "network-only"
    })

    if(resultGetProfile.data) return <Navigate to="/" />

    if(resultGetProfile.loading || resultGetCountOfAdmins.loading) return <Loading />

    if(resultGetCountOfAdmins.data.countOfAdmins == 0) return <Navigate to="/singup" />

    return children
}