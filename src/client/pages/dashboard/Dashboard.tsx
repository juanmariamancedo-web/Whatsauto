import { Outlet } from "react-router-dom"
import Menu from "./components/Menu"
import { useQuery } from "@apollo/client"
import { GET_PROFILE } from "../../graphql/queries"
import { Cookies } from "../../utils/cookies"
import Loading from "../../components/Loading"

const cookies = Cookies()

export default function Dashboard(){
    const {data, loading} = useQuery(GET_PROFILE, {
        context: {
            headers: {
                authorization: `bearer ${cookies.getCookie("token")}`
            }
        }
    })

    if(loading) <Loading />

    if(data) return(
        <>
            <Menu profile={data.profile} />
            <div className="flex justify-end w-full min-h-screen">
                <div className="min-h-screen basis-full lg:basis-3/4 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-900 dark:to-blue-900 dark:text-white relative">
                    <Outlet />
                </div>
            </div>
        </>
    )
}