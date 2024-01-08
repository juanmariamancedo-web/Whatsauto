import { FormEvent, useEffect, useState } from "react"
import { UPDATE_EMAIL } from "../../graphql/mutations"
import { useMutation } from "@apollo/client"
import Loading from "../../components/Loading"
import { Cookies } from "../../utils/cookies"
import { Navigate, useSearchParams } from "react-router-dom"
import Success from "../../components/Success"
import GraphQLErrorsComponent from "../../components/GraphQLErrorsComponent"
import useTitle from "../../hooks/useTitle"

const cookies = Cookies()

export default function ReciveTokenForUpdateEmail(){
    const [updateEmail, {data, loading, error}] = useMutation(UPDATE_EMAIL)
    const [token, setToken] = useState("")
    const [searchParams] = useSearchParams()

    useTitle("Receive token for update email")

    const [ignoreError, setIgnoreError] = useState(false)

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

    useEffect(function(){
        if(searchParams.get("token")) {
            updateEmail({
                variables: {
                    token: searchParams.get("token")
                },
                context: {
                    headers: {
                        Authorization: `bearer ${cookies.getCookie("token")}`
                    }
                }
            })
        }    
    }, [searchParams])
    
    if(loading) return <Loading />

    if(error && !ignoreError) return <GraphQLErrorsComponent error={error} setIgnoreError={setIgnoreError} />
    
    if(data) return <Success><Navigate to="/dashboard/profile" /></Success>

    return(
        <div className="min-h-screen w-ful flex justify-center items-center">
            <div className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3">
                    <label className="flex flex-col dark:text-white">
                        Token:
                        <input type="text" className="p-1 rounded-xl dark:text-black" value={token} onChange={(e)=>setToken(e.target.value)} />
                    </label>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
            </div>
        </div>
    )
}