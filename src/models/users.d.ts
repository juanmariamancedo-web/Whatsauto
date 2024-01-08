export type User = {
    id: number
    username:string,
    password?:string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    avatar: Avatar
}

export type CreateUserArgs = {
    username: string
    password: string
    firstName: string
    lastName: string
    role: Roles
    email: string
}

export type Avatar = {
    id: number,
    style: string,
    seed: string,
}