import { useState, useEffect, FormEvent } from "react"
import { ImageAvatar } from "../../profile/change-avatar/components/ImageAvatar"
import { Cookies } from "../../../utils/cookies"
import { UPDATE_AVATAR } from "../../../graphql/mutations"
import { useMutation, useQuery } from "@apollo/client"
import { GET_USER } from "../../../graphql/queries"
import Loading from "../../../components/Loading"
import { Navigate, useSearchParams } from "react-router-dom"
import Success from "../../../components/Success"
import GraphQLErrorsComponent from "../../../components/GraphQLErrorsComponent"
import useEditAvatarParams from "../../../hooks/useEditAvatarParams"
import capitalizarTexto from "../../../utils/capitalizarTexto"
import { stylesAvatar as styles } from "../../../../models/stylesAvatar"
import useTitle from "../../../hooks/useTitle"

const cookies = Cookies()

export function ChangeAvatarOfUser(){
    useTitle("Change user")
    
    const [updateAvatar, result] = useMutation(UPDATE_AVATAR)
    
    const [searchParams] = useSearchParams()
    
    const [ignoreError, setIgnoreError] = useState(false)
    
    const profile = useQuery(GET_USER, {
        context: {
            headers: {
                authorization: `bearer ${cookies.getCookie("token")}`
            }
        },
        variables: {
            userId: parseInt(searchParams.get("userId") || "")
        }
    })

    const {seed, setSeed, selectedStyle, setSelectedStyle} = useEditAvatarParams(profile)

    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault()
        updateAvatar({
            variables: {
                style: selectedStyle,
                seed,
                userId: parseInt(searchParams.get("userId") || "")
            },
            context: {
                headers: {
                    Authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
        })
    }

    if(profile.loading || result.loading) return <Loading />
    if(result.error && !ignoreError) return <GraphQLErrorsComponent error={result.error} setIgnoreError={setIgnoreError} />
    if(result.data) return <Success><Navigate to="/dashboard/users" /></Success> 

    return(
        <div className="min-h-screen w-ful flex justify-center items-center">
            <div className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3">
                <div className="flex justify-center items-center">
                    <ImageAvatar style={selectedStyle} seed={seed} size={100}/>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3">
                    <label className="flex flex-col dark:text-white">
                        Style:
                        <select value={capitalizarTexto(selectedStyle.replaceAll("-", " "))} onChange={(e)=>{setSelectedStyle(e.target.value.toLocaleLowerCase().replaceAll(" ", "-"))}} className="dark:bg-white dark:text-black">
                            {styles.map((e)=>{
                                return(
                                    <option value={e} key={e}>{e}</option>
                                )
                            })}
                        </select>
                    </label>
                    <label className="flex flex-col dark:text-white">
                        Seed: 
                        <input type="text" value={seed} onChange={(e)=>{setSeed(e.target.value)}} className="p-1 rounded-xl dark:text-black" />
                    </label>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
            </div>
        </div>
    )
}