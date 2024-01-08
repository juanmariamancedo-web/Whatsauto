import { useState, useEffect } from "react"
import { User } from "../../models/users"
import { Role } from "../../enums/Roles"

export default function useEditUserParams(data: {profile: User}){
    const [selectedRole, setSelectedRole] = useState<Role>()
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    useEffect(()=>{
        if(data){
            setSelectedRole(data.profile.role as Role)
            setUsername(data.profile.username as string)
            setFirstName(data.profile.firstName as string)
            setLastName(data.profile.lastName as string)
        }
      }, [data])

    return {selectedRole, setSelectedRole, username, setUsername, firstName, setFirstName, lastName, setLastName}
}