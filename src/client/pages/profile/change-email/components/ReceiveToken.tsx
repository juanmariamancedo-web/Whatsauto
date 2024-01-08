import { FormEvent, useState } from "react"
import { UPDATE_EMAIL } from "../../../../graphql/mutations"
import { useMutation } from "@apollo/client"
import Loading from "../../../../components/Loading"
import { Cookies } from "../../../../utils/cookies"
import { Navigate } from "react-router-dom"

const cookies = Cookies()

export default function ReciveToken({tokenFromSearchParams}:{tokenFromSearchParams:string|null}){
    const [updateEmail, {data, loading}] = useMutation(UPDATE_EMAIL)
    const [token, setToken] = useState("")

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        updateEmail({
            variables: {
                token
            },
            context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
        })
    }

    if(tokenFromSearchParams) {
        updateEmail({
            variables: {
                token
            },
            context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
        })
    }

    if(loading) return <Loading />

    if(data) return <Navigate to="/dashboard/profile" />

    return(
        <div className="min-h-screen w-ful flex justify-center items-center">
            <div className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3">
                    <label className="flex flex-col dark:text-white">
                        Token:
                        <input type="text" className="p-1 rounded-xl dark:text-black" value={token} onChange={(e)=>setToken(e.target.value)} />
                    </label>
                    <input type="submit" value="Submit" className="p-1 rounded-xl dark:bg-white dark:text-black" />
                </form>
            </div>
        </div>
    )
}