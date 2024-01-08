import { Context } from "../../../../../models/Context";
import prisma from "../../../../utils/prisma"
import {parse, addDays} from "date-fns"
import { GraphQLError } from "graphql";

const quieriesSurvey = {
    filterSurveysForRangeDate: async (_root:unknown, {fechaInicio, fechaFin}: {fechaInicio:string, fechaFin:string}, {currentUser, checkAuthentication}: Context)=>{  
      try {
      
          checkAuthentication(currentUser)

          return await prisma.survey.findMany({
              where: {
                createdAt: {
                  gte: parse(fechaInicio, "dd/MM/yyyy", new Date()), // Mayor o igual que fechaInicio
                  lte: addDays(parse(fechaFin, "dd/MM/yyyy", new Date()), 1)    // Menor o igual que fechaFin
                },
              },
            });
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    }
}

export default quieriesSurvey