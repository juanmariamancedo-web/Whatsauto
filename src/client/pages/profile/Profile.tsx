import { Cookies } from "../../utils/cookies"
import { useMutation, useQuery } from "@apollo/client"
import { Link } from "react-router-dom"
import { FormEvent, useEffect, useState, ChangeEvent } from "react"
import { UPDATE_USER } from "../../graphql/mutations"
import { Role as Roles } from "../../../enums/Roles"
import { GET_COUNT_OF_ADMINS, GET_PROFILE } from "../../graphql/queries"
import Loading from "../../components/Loading"
import Success from "../../components/Success"
import { Navigate } from "react-router-dom"
import GraphQLErrorsComponent from "../../components/GraphQLErrorsComponent"
import useEditParams from "../../hooks/useEditUserParams"
import useTitle from "../../hooks/useTitle"

const cookies = Cookies()

export default function Profile(){
    const [updateUser, result] = useMutation(UPDATE_USER)
    const [ignoreError, setIgnoreError] = useState(false)
    
    useTitle("Proflie")

    const countOfAdmins = useQuery(GET_COUNT_OF_ADMINS,{
        fetchPolicy: 'network-only'
    })
    const profile = useQuery(GET_PROFILE, {
        context: {
            headers: {
                authorization: `bearer ${cookies.getCookie("token")}`
            }
        }
    })
    
    const [role, setRole] = useState<Roles>()
    const {selectedRole, setSelectedRole, username, setUsername, firstName, setFirstName, lastName, setLastName} = useEditParams(profile.data)
    
    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault()
        updateUser({
            variables: {
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

    useEffect(()=>{
        if(result.data){
            setRole(result.data.updateUser.role as Roles)
        }
    }, [result])
    
    function changeRole(event:ChangeEvent<HTMLSelectElement>){
        setSelectedRole(event.target.value as Roles)
    }
    
    useEffect(()=>{
        if(profile.data){
            setRole(profile.data.profile.role as Roles)
        }
      }, [profile])

    if(countOfAdmins.loading || profile.loading) return <Loading />
    if(result.error && !ignoreError) return <GraphQLErrorsComponent error={result.error} setIgnoreError={setIgnoreError} />  
    if(result.data) return <Success><Navigate to="/" /></Success>

    if(countOfAdmins.data && profile.data) return(
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
                            <input type="email" value={profile.data.profile.email as string} disabled={true} className="p-1 basis-3/4 rounded-xl dark:text-black" />
                            <Link to="/dashboard/profile/change-email" className="primary-button basis-1/4">Editar</Link>
                        </div>
                    </label>
                    <select value={selectedRole} onChange={changeRole} disabled={!(countOfAdmins.data.countOfAdmins > 1 && role == Roles.ADMIN)} className="dark:bg-white dark:text-black text-center">
                        <option value={Roles.ADMIN} selected={profile.data.profile.role == Roles.ADMIN}>ADMIN</option>
                        <option value={Roles.EDITOR} selected={profile.data.profile.role == Roles.EDITOR}>EDITOR</option>
                    </select>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
                <div className="flex flex-wrap gap-3 justify-between">
                    <Link to="/dashboard/profile/change-avatar" className="grow primary-button">
                        Change avatar
                    </Link>
                    <Link to="/dashboard/profile/change-password" className="grow primary-button">
                        Change password
                    </Link>
                </div>
            </div>
        </div>
    )
}