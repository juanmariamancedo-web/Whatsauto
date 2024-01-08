import { useState, useEffect } from "react"
import { User } from "../../models/users"

export default function useEditAvatarParams({data}: {data: {profile: User}}){
    const [selectedStyle, setSelectedStyle] = useState("")
    const [seed, setSeed] = useState("")

    useEffect(()=>{
        if(data){
            setSelectedStyle(data.profile.avatar.style)
            setSeed(data.profile.avatar.seed)
        }
    }, [data])

    return {selectedStyle, setSelectedStyle, seed, setSeed}
}