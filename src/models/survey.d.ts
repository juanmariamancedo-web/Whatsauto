export type Survey = {
    id:number
    createdAt:string
    firstQuestion:string
    secondQuestion:string
    thirdQuestion:string
    fourthQuestion:string
    fifthQuestion:string
    sixthQuestion:string
    seventhQuestion:string
    comentaries:string
    chat:Chat
}

type Chat = {
    phone:string
}