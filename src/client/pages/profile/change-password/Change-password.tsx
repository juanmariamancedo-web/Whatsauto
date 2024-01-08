import { FormEvent, useState, ChangeEvent } from "react"
import NewPassword from "../../../components/newPassword/NewPassword"
import { useMutation } from "@apollo/client"
import { UPDATE_PASSWORD } from "../../../graphql/mutations"
import { Cookies } from "../../../utils/cookies"
import Loading from "../../../components/Loading"
import { Navigate } from "react-router-dom"
import Success from "../../../components/Success"
import useTitle from "../../../hooks/useTitle"

const cookies = Cookies()

export default function ChangePassword(){
    const [newPassword, setNewPassword] = useState("")
    const [lastPassword, setLastPassword] = useState("")
    const [updatePassword, {data, error, loading}] = useMutation(UPDATE_PASSWORD)
    
    useTitle("Change password")

    const [approvedPassword, setApprovedPassword] = useState(false)

    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault()
        if(approvedPassword){
            updatePassword({
                variables: {
                    lastPassword,
                    newPassword
                },
                context: {
                    headers: {
                        Authorization: `bearer ${cookies.getCookie("token")}`
                    }
                }
            })
        }
    }

    if(loading) return <Loading />
    if(data) return <Success><Navigate to="/dashboard/profile" /></Success>

    return(
        <div className="min-h-screen w-ful flex justify-center items-center">
            <div className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3">
                    <label className="flex flex-col dark:text-white">
                        <span>Last password</span>
                        <input type="password" value={lastPassword} onChange={(e:ChangeEvent<HTMLInputElement>)=> setLastPassword(e.target.value)} className="rounded-xl px-2"/>
                    </label>
                    <div className="overflow-hidden">
                        <p className={`${error && error.message == "The password is not correct"? "": "-mb-[100%]"}  relative transition-all duration-1000 ease-linear`}>
                            The password is not correct
                        </p>
                    </div>
                    <NewPassword password={newPassword} setPassword={setNewPassword} setApproved={setApprovedPassword}/>                    
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
            </div>
        </div>
    )
}