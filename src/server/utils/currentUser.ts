const Jwt = require("jsonwebtoken")
import express = require('express');
import { User } from '../../models/users';
import prisma from './prisma';

export function isRequest(auth:express.Request | null): auth is express.Request{
    if(auth) return true
    return false
}

export async function getCurrentUser(authorization:string | undefined):Promise<User | undefined>{
    try {
        if(authorization && authorization.toLowerCase().startsWith("bearer ")){
            const token = authorization.substring(7)

            const { id } = await Jwt.verify(token, process.env.SECRET)

            return await prisma.user.findUnique({
                where : {
                    id
                }
            })     
        }
    } catch (error) {
        return undefined
    }

    return undefined
}