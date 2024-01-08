
import prisma from "../../../../utils/prisma"
import { type Survey } from "@prisma/client"
import {format} from "date-fns"
import { GraphQLError } from "graphql"

const subQuieriesSurvey = {
    chat: (root:Survey)=>{
        try {
            return prisma.chat.findFirst({
                where: {
                    id: root.chatId
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
    createdAt: (root:Survey)=>{
        try {
            return format(new Date(root.createdAt), 'dd/MM/yyyy HH:mm:ss')
        } catch (error) {
            throw new GraphQLError("Internal server error", {
                extensions: {
                  code: "INTERNAL_SERVER_ERROR"
                }
              }) 
        }
    }
}

export default subQuieriesSurvey