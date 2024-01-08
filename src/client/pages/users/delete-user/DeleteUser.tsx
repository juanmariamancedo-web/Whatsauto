import { useMutation, useQuery } from "@apollo/client"
import { DELETE_USER } from "../../../graphql/mutations"
import { GET_USER } from "../../../graphql/queries"
import { Cookies } from "../../../utils/cookies"
import { Link, Navigate, useSearchParams } from "react-router-dom"
import { useState } from "react"
import GraphQLErrorsComponent from "../../../components/GraphQLErrorsComponent"
import Loading from "../../../components/Loading"
import Success from "../../../components/Success"
import useTitle from "../../../hooks/useTitle"

const cookies = Cookies()

export default function DeleteUser(){
    useTitle("Delete user")
    const [searchParams] = useSearchParams()
    
    const [deleteUser, result] = useMutation(DELETE_USER)
    const [ignoreError, setIgnoreError] = useState(false)
    
    const {data, loading} = useQuery(GET_USER, {
        variables: {
            userId: parseInt(searchParams.get("userId") || "")
        },
        context: {
            headers: {
                Authorization: `bearer ${cookies.getCookie("token")}`
            }
        }
    })

    function handleDelete(){
        deleteUser({
            variables: {
                userId: parseInt(searchParams.get("userId") || "")
            },
            context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
        })
    }

    if(loading) return <Loading />
    if(result.error && !ignoreError) return <GraphQLErrorsComponent error={result.error} setIgnoreError={setIgnoreError} />
    if(result.data) return <Success><Navigate to="/dashboard/users"/></Success>

    if(data) return(
        <div className={`min-h-screen w-full flex justify-center items-center`}>
            <div className="flex flex-col gap-3 p-3 shadow-xl rounded-xl">
                <p>
                    Do you wanna to delete <span className="font-mono">{data.profile.username}</span> 
                </p>
                <div className="flex gap-3 justify-center">
                    <button onClick={handleDelete}>Yes</button>
                    <Link to="/dashboard/users">No</Link>
                </div>
            </div>
        </div>
    )
}