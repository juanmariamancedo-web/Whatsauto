import { Link, useSearchParams } from "react-router-dom"
import { GET_USERS } from "../../graphql/queries"
import { useQuery } from "@apollo/client"
import Loading from "../../components/Loading"
import { Cookies } from "../../utils/cookies"
import { User } from "../../../models/users"
import { ImageAvatar } from "../profile/change-avatar/components/ImageAvatar"
import useTitle from "../../hooks/useTitle"

const cookies = Cookies()

export default function Users(){
    const [searchParams] = useSearchParams()
    
    useTitle("Users")

    const page = parseInt(searchParams.get("page") || "1")
    
    const {data, loading } = useQuery(GET_USERS, {
        context: {
            headers: {
                Authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        variables: {
            page
        },
        fetchPolicy: "network-only"
    })

    if(loading) <Loading />

    if(data) return(
        <div className="min-h-screen w-full flex justify-center items-center">
            <section className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3 min-w-[90%] md:min-w-[80%] lg:min-w-[70%]">
                <header className="flex justify-between">
                    <Link className="font-mono primary-button" to="/dashboard/users/create">
                        Create User:
                    </Link>
                </header>
                {data.paginationUsers.data && 
                <ul className="grid grid-rows-6 gap-3">
                    {data.paginationUsers.data.map((e:User)=>{
                        return(
                            <li key={e.id} className="flex justify-between items-center">
                                <div className="flex justify-between items-center gap-3">
                                    <ImageAvatar style={e.avatar.style} seed={e.avatar.seed} size={32} />
                                    <p>{e.username}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Link to={`/dashboard/users/edit?userId=${e.id}`} className="primary-button">edit</Link>
                                    <Link to={`/dashboard/users/delete?userId=${e.id}`} className="primary-button">delete</Link>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                }
                {data.paginationUsers.pagination.totalPages > page || page > 1?
                    <footer className="flex justify-center items-center">
                        <div className="grid grid-cols-3 grid-rows-1 gap-3 justify-items-center">
                            {data.paginationUsers.pagination.page > 1 && 
                            <div className="col-start-1">
                                <Link className="font-icon bg-yellow-300 py-2 px-1 rounded-md" to={`?page=${page - 1}`}>navigate_before</Link>
                            </div>
                            }
                            <div className="col-start-2">
                                <span className="font-mono">{page}</span>
                            </div>
                            {data.paginationUsers.pagination.totalPages > data.paginationUsers.pagination.page &&
                            <div className="col-start-3">
                                <Link className="font-icon bg-yellow-300 py-2 px-1 rounded-md" to={`?page=${page + 1}`}>navigate_next</Link>
                            </div>
                            }
                        </div>
                    </footer>
                :null}
            </section>
        </div>
    )
}