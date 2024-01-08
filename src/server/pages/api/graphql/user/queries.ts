import { Context } from "../../../../../models/Context"
import { Role } from "../../../../../enums/Roles"
import { GraphQLError } from "graphql"
import prisma from "../../../../utils/prisma"

const usersQueries = {
    async paginationUsers(_root:any, {page = 1, docs = 6}:{page:number, docs: number}, {checkAuthentication, currentUser, prisma}:Context){
        try {
            
            checkAuthentication(currentUser)
    
            if(currentUser?.role != Role.ADMIN) throw new GraphQLError('You are not authorized to perform this action.', {
                extensions: {
                  code: 'FORBIDDEN',
                }
            });
    
            const users = await prisma.user.findMany({
                where: {
                    id: {
                        not: currentUser.id,
                    }
                },
                take: docs,
                skip: (page - 1) * docs
            })
    
            const totalUser = await prisma.user.findMany({
                where: {
                    id: {
                        not: currentUser.id,
                    }
                }
            })
    
            return({
                data: users,
                pagination: {
                    page,
                    totalDocs: totalUser.length,
                    totalPages: Math.ceil(totalUser.length / docs)
                }
            })
        } catch (error) {
            throw new GraphQLError("Internal server error", {
                extensions: {
                  code: "INTERNAL_SERVER_ERROR"
                }
              }) 
        }
    },
    async getUser(_root:any, {userID}: {userID:number}, {currentUser, checkAuthentication}:Context){
        try {
            checkAuthentication(currentUser)
            if(currentUser?.role != Role.ADMIN) throw new GraphQLError('You are not authorized to perform this action.', {
                extensions: {
                  code: 'FORBIDDEN',
                },
            });
    
            return await prisma.user.findUnique({
                where: {
                    id: userID
                }
            })
        } catch (error) {
            throw new GraphQLError("Internal server error", {
                extensions: {
                  code: "INTERNAL_SERVER_ERROR"
                }
              }) 
        }
    },
    me: (_parent:any, _args:any, {currentUser, checkAuthentication}:Context)=>{
        try {
            checkAuthentication(currentUser)
            return currentUser
        } catch (error) {
            throw new GraphQLError("Internal server error", {
                extensions: {
                  code: "INTERNAL_SERVER_ERROR"
                }
              }) 
        }
    },
    countOfAdmins: async(_root:any, _args:any, {prisma}:Context)=>{
        try {
            
            const user = await prisma.user.findMany({
                where: {
                role: "ADMIN"
                }
            })
            return user.length
        } catch (error) {
            throw new GraphQLError("Internal server error", {
                extensions: {
                  code: "INTERNAL_SERVER_ERROR"
                }
              }) 
        }
    }
}

export default usersQueries