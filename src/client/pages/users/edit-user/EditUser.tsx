import { useQuery } from "@apollo/client"
import { Navigate, useSearchParams } from "react-router-dom"
import { GET_USER } from "../../../graphql/queries"
import Loading from "../../../components/Loading"
import { Cookies } from "../../../utils/cookies"
import { useEffect, useState, ChangeEvent } from "react"
import { Role as Roles } from "../../../../enums/Roles"
import { Link } from "react-router-dom"
import { useMutation } from "@apollo/client"
import { UPDATE_USER } from "../../../graphql/mutations"
import { FormEvent } from "react"
import Success from "../../../components/Success"
import GraphQLErrorsComponent from "../../../components/GraphQLErrorsComponent"
import useEditParams from "../../../hooks/useEditUserParams"
import useTitle from "../../../hooks/useTitle"

const cookies = Cookies()

export default function EditUser(){
    useTitle("Edit user")

    const [ searchParams ] = useSearchParams()
    
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
    const {selectedRole, setSelectedRole, username, setUsername, firstName, setFirstName, lastName, setLastName} = useEditParams(data)
    
    const [updateUser, result] = useMutation(UPDATE_USER)
    
    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault()
        updateUser({
            variables: {
                userId: parseInt(searchParams.get("userId") || ""),
                role: selectedRole,
                username,
                firstName,
                lastName
            },
            context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
        })
    }

    
    function changeRole(event:ChangeEvent<HTMLSelectElement>){
        setSelectedRole(event.target.value as Roles)
    }

    if(loading || result.loading) return <Loading />
    if(result.error && !ignoreError) return <GraphQLErrorsComponent error={result.error} setIgnoreError={setIgnoreError} />
    if(result.data) return <Success><Navigate to="/dashboard/users" /></Success>

    if(data) return(
        <div className="flex justify-center items-center h-full">
            <div className="p-3 rounded-2xl shadow-xl flex flex-col items-center gap-3">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-3 flex-wrap">
                    <label className="flex flex-col dark:text-white">
                        Username: 
                        <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} className="p-1 rounded-xl dark:text-black" />
                    </label>
                    <label className="flex flex-col dark:text-white">
                        FirstName: 
                        <input type="text" value={firstName} onChange={(e)=>{setFirstName(e.target.value)}} className="p-1 rounded-xl dark:text-black" />
                    </label>
                    <label className="flex flex-col dark:text-white">
                        LastName:
                        <input type="text" value={lastName} onChange={(e)=>{setLastName(e.target.value)}} className="p-1 rounded-xl dark:text-black" />
                    </label>
                    <label className="flex flex-col dark:text-white">
                        Email:
                        <div className="flex justify-between gap-2">
                            <input type="email" value={data.profile.email as string} disabled={true} className="p-1 basis-3/4 rounded-xl dark:text-black" />
                            <Link to={`/dashboard/users/change-email?userId=${searchParams.get("userId")}`} className="primary-button basis-1/4">Editar</Link>
                        </div>
                    </label>
                    <select value={selectedRole} onChange={changeRole} className="primary-button">
                        <option value={Roles.ADMIN} selected={data.profile.role == Roles.ADMIN}>ADMIN</option>
                        <option value={Roles.EDITOR} selected={data.profile.role == Roles.EDITOR}>EDITOR</option>
                    </select>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
                <div className="flex flex-wrap gap-3 justify-between">
                    <Link to={`/dashboard/users/change-avatar?userId=${searchParams.get("userId")}`} className="grow primary-button">
                        Change avatar
                    </Link>
                </div>
            </div>
        </div>
    )
}