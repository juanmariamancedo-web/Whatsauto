import { User } from "@prisma/client"
import { Context } from "../../../../../models/Context"
import { GraphQLError } from "graphql"

const subQueriesUser = {
    avatar: async (root:User, _args:any, {prisma}:Context)=> {
        try {
            return await prisma.avatar.findUnique({
                where: {
                    userID: root.id
                }
            })
        } catch (error) {
            throw new GraphQLError("Internal server error", {
                extensions: {
                  code: "INTERNAL_SERVER_ERROR"
                }
              }) 
        }
    }
}

export default subQueriesUser