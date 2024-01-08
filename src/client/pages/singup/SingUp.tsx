import NewPassword from "../../components/newPassword/NewPassword"
import { useMutation } from "@apollo/client"
import { FormEvent } from "react"
import { useState } from "react"
import ProtectedSingUp from "./components/ProtectedSingUp"
import { SEND_KEY_FOR_CREATE_FIRST_USER } from "../../graphql/mutations"
import Loading from "../../components/Loading"
import { Navigate, useSearchParams } from "react-router-dom"
import GraphQLErrorsComponent from "../../components/GraphQLErrorsComponent"
import Success from "../../components/Success"
import useTitle from "../../hooks/useTitle"

export default function SingUp(){
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [ignoreError, setIgnoreError] = useState(false)
    const [createUser, {data, loading, error}] = useMutation(SEND_KEY_FOR_CREATE_FIRST_USER)

    useTitle("Sing Up")

    const [approvedPassword, setApprovedPassword] = useState(false)

    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault()
        if(approvedPassword){
            createUser({
               variables: {
                   username,
                   password,
                   firstName,
                   lastName,
                   email
               }
           })
        }
    }

    if(loading) return <Loading />

    if(data) return <Success><Navigate to="/receive-token-for-create-user" /></Success> 

    if(error && !ignoreError) return <GraphQLErrorsComponent error={error} setIgnoreError={setIgnoreError} />
    
    return(
        <ProtectedSingUp> 
            <div className="flex justify-center items-center">
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
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
            </div>
        </ProtectedSingUp>
    )
}