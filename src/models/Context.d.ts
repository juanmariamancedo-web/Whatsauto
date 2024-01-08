import type { User } from "./users"

export type Context ={
    currentUser: User| undefined,
    checkAuthentication: (currentUser:User | undefined)=> void,
    checkToUpdateUser: (currentUser:User | undefined, args:any, userID:number) => Promise<void>,
    prisma: any
}