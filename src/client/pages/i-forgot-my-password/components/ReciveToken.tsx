import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { FormEvent } from "react"
import Loading from "../../../components/Loading"
import { Navigate, useSearchParams } from "react-router-dom"
import { UPDATE_PASSWORD_WITH_KEY } from "../../../graphql/mutations"
import NewPassword from "../../../components/newPassword/NewPassword"

export default function ReceiveTokenForUpdatePassword(){
    const [updatePassword, {data, loading}] = useMutation(UPDATE_PASSWORD_WITH_KEY)
    const [token, setToken] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [approved, setApproved] = useState(false)

    const [searchParams] = useSearchParams()

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        if(approved) updatePassword({
            variables: {
                key: token,
                newPassword
            }
        })
    }

    useEffect(function(){
        if(searchParams.get("token")){
            setToken(searchParams.get("token") || "")
        }
    }, [searchParams])

    if(loading) return <Loading />

    if(data) return <Navigate to="/dashboard/profile" />

    return(
        <div className="min-h-screen w-ful flex justify-center items-center">
            <div className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3">
                    <label className="flex flex-col dark:text-white">
                        Key:
                        <input type="text" className="p-1 rounded-xl dark:text-black" value={token} onChange={(e)=>setToken(e.target.value)} />
                    </label>
                    <NewPassword password={newPassword} setPassword={setNewPassword} setApproved={setApproved} />
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
            </div>
        </div>
    )
}