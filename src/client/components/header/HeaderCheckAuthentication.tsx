import { Cookies } from "../../utils/cookies"
import { GET_PROFILE } from "../../graphql/queries"
import { useQuery } from "@apollo/client"
import LogInOut from "../LogInOut"
import Loading from "../Loading"
import { Link, useLocation } from "react-router-dom"
import { ImageAvatar } from "../../pages/profile/change-avatar/components/ImageAvatar"

const cookies = Cookies()

export default function HeaderCheckAuthentication(){
    const { pathname } = useLocation()

    const {data, loading} = useQuery(GET_PROFILE, {
        context: {
            headers: {
                authorization: `bearer ${cookies.getCookie("token")}`
            }
        }
    })

    if(loading) <Loading />

    if(data && (pathname == "/"  || pathname.includes("/dashboard"))) return(
    <>
        <li className="order-2">
            <LogInOut/>
        </li>
        <li className="flex justify-center items-center order-1">
            <Link to="/dashboard/profile">
                <ImageAvatar size={32} style={data.profile.avatar.style} seed={data.profile.avatar.seed} />
            </Link>
        </li>
    </>
    )
}