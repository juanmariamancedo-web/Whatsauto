import { useMutation } from "@apollo/client"
import { useState } from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import { FormEvent } from "react"
import Loading from "../../components/Loading"
import GraphQLErrorsComponent from "../../components/GraphQLErrorsComponent"
import { SEND_KEY_FOR_UPDATE_PASSWORD } from "../../graphql/mutations"
import ReceiveTokenForUpdatePassword from "./components/ReciveToken"
import useTitle from "../../hooks/useTitle"

export default function IForgotMyPassword(){
    const [sendToken, {data, loading, error}] = useMutation(SEND_KEY_FOR_UPDATE_PASSWORD)
    const [emailOrUsername, setEmailOrUsername] = useState("")
    const [ignoreError, setIgnoreError] = useState(false)

    useTitle("Forgot my password")
    const [searchParams] = useSearchParams()

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        sendToken({
            variables: {
                emailOrUsername
            },
        })
        setIgnoreError(false)
    }

    if(loading) return <Loading />

    if(data || searchParams.get("token")) return <ReceiveTokenForUpdatePassword />
    if(error && !ignoreError) return <GraphQLErrorsComponent error={error} setIgnoreError={setIgnoreError} />
    
    return(
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3 shadow-2xl rounded-2xl p-3 ">
                <label className="flex flex-col dark:text-white">
                    Email or username:
                    <input type="text" className="p-1 rounded-xl dark:text-black" value={emailOrUsername} onChange={(e)=>setEmailOrUsername(e.target.value)} />
                </label>
                <input type="submit" value="Submit" className="primary-button" />
            </form>
        </div>
    )
}