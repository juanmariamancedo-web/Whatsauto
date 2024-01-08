import NewPassword from "../../../components/newPassword/NewPassword"
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { Cookies } from "../../../utils/cookies"
import { SEND_KEY_FOR_CREATE_USER } from "../../../graphql/mutations"
import { FormEvent } from "react"
import { Role, Role as Roles } from "../../../../enums/Roles"
import { ChangeEvent } from "react"
import Loading from "../../../components/Loading"
import { Navigate } from "react-router-dom"
import GraphQLErrorsComponent from "../../../components/GraphQLErrorsComponent"
import Success from "../../../components/Success"
import useTitle from "../../../hooks/useTitle"

const cookies = Cookies()

export default function CreateUser(){
    useTitle("Create user")
    const [ignoreError, setIgnoreError] = useState(false)

    const [selectedRole, setSelectedRole] = useState(Roles.EDITOR)
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [approvedPassword, setApprovedPassword] = useState(false)

    const [createUser, {loading, data, error}] = useMutation(SEND_KEY_FOR_CREATE_USER)

    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault()
        if(approvedPassword){
            createUser({
               variables: {
                   username,
                   password,
                   firstName,
                   lastName,
                   email,
                   role: selectedRole
               },
               context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
           })

           setIgnoreError(false)
        }
    }

    function changeRole(event:ChangeEvent<HTMLSelectElement>){
        setSelectedRole(event.target.value as Roles)
    }

    if(loading) return <Loading />

    if(data) return <Success><Navigate to="/dashboard/users" /></Success>

    if(error && !ignoreError) return <GraphQLErrorsComponent error={error} setIgnoreError={setIgnoreError} />

    return(
        <div className="min-h-screen w-full flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3 shadow-2xl rounded-2xl p-3">
                <label className="flex flex-col dark:text-white">
                    Username: 
                    <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} className="p-1 rounded-xl dark:text-black" />
                </label>
                <NewPassword password={password} setPassword={setPassword} setApproved={setApprovedPassword} />
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
                    <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} className="p-1 rounded-xl dark:text-black" />
                </label>
                <select value={selectedRole} onChange={changeRole} className="primary-button">
                    <option value={Roles.ADMIN}>ADMIN</option>
                    <option value={Roles.EDITOR}>EDITOR</option>
                </select>
                <input type="submit" value="Submit" className="primary-button" />
            </form>
        </div>
    )
}