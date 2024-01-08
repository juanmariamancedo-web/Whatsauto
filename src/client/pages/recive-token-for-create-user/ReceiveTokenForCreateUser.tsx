import { FormEvent, useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { Cookies } from "../../utils/cookies"
import { Navigate, useSearchParams } from "react-router-dom"
import Loading from "../../components/Loading"
import { CREATE_USER } from "../../graphql/mutations"
import GraphQLErrorsComponent from "../../components/GraphQLErrorsComponent"
import ProtectedReceiveTokenForCreateUser from "./components/ProtectedReceiveTokenForCreateUser"
import Success from "../../components/Success"
import useTitle from "../../hooks/useTitle"

const cookies = Cookies()

export default function ReceiveTokenForCreateUser(){
    const [updateUser, {data, loading, error}] = useMutation(CREATE_USER)
    const [token, setToken] = useState("")

    useTitle("Receive token for create user")
    
    const [ignoreError, setIgnoreError] = useState(false)

    const [searchParams] = useSearchParams()

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        updateUser({
            variables: {
                token
            },
            context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            },
            fetchPolicy: "network-only"
        })
    }

    useEffect(function(){
        if(searchParams.get("token")) {
            updateUser({
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

    if(data) return <Success><Navigate to="/login" /></Success> 

    return(
        <ProtectedReceiveTokenForCreateUser>
            <div className="flex justify-center items-center">
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
        </ProtectedReceiveTokenForCreateUser>
    )
}