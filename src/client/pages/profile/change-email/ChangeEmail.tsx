import { FormEvent, useState } from "react"
import { SEND_TOKEN_FOR_UPDATE_EMAIL } from "../../../graphql/mutations"
import { useMutation } from "@apollo/client"
import Loading from "../../../components/Loading"
import { Cookies } from "../../../utils/cookies"
import { Navigate } from "react-router-dom"
import GraphQLErrorsComponent from "../../../components/GraphQLErrorsComponent"
import Success from "../../../components/Success"
import useTitle from "../../../hooks/useTitle"

const cookies = Cookies()

export default function ChangeEmail(){
    const [sendToken, {data, loading, error}] = useMutation(SEND_TOKEN_FOR_UPDATE_EMAIL)
    const [newEmail, setNewEmail] = useState("")
    const [ignoreError, setIgnoreError] = useState(false)

    useTitle("Change email")

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        sendToken({
            variables: {
                email: newEmail
            },
            context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
        })
        setIgnoreError(false)
    }

    if(loading) return <Loading />

    if(data) return  <Success><Navigate to="/receive-token-for-update-email" /></Success> 

    if(error && !ignoreError) return <GraphQLErrorsComponent error={error} setIgnoreError={setIgnoreError} />
    
    return(
        <div className="min-h-screen w-ful flex justify-center items-center">
            <div className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3">
                    <label className="flex flex-col dark:text-white">
                        New email:
                        <input type="email" className="p-1 rounded-xl dark:text-black" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} />
                    </label>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
            </div>
        </div>
    )
}