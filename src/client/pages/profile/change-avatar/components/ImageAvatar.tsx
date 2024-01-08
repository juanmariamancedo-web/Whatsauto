"use client"

interface props {
    style:string,
    seed:string,
    size:number
}
export function ImageAvatar({style, seed, size}: props){
    return(
        <img src={`https://api.dicebear.com/6.x/${style}/svg?seed=${seed}`} 
            width={size} 
            height={size}
            alt="Avatar"/>
    )
}