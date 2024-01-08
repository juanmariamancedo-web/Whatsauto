import {checkAffirmation, checkNegation, checkRange} from "./checkMessage"
import { type Survey } from "@prisma/client"
import prisma from "./prisma"

export default async function checkContext(survey:Survey, message:string): Promise<[Survey, boolean, string | undefined]>{
    let cont = false
    let reply:string | undefined
    let surveyReturn = survey

    if(survey.question == 0 && checkAffirmation(message)){
        surveyReturn = await prisma.survey.update({
          where: {
            id: survey.id
          },
          data: {
            question: 1
          }
        })
    }else if(survey.question == 8 && checkAffirmation(message)){
        surveyReturn = prisma.survey.create({
            data: {
                question: 1
            }
        })
    }else if((survey.question == 0 || survey.question == 8) && checkNegation(message)){
        reply = "Okey, muchas gracias por su tiempo!!!"
        surveyReturn = await prisma.survey.update({
            where: {
                id: survey.id
            },
            data: {
                question: 9,
            }
        })
    }else if(survey.question == 8){
        reply = "Okey, muchas gracias por sus comentarios"
        surveyReturn = await prisma.survey.update({
            where: {
                id: survey.id
            },
            data: {
                question: 9,
                comentaries: message
            }
        })
    }else if((survey.question > 0 && survey.question < 5 && checkRange(message)) || (survey.question > 4 && survey.question < 9)){
        surveyReturn = await prisma.survey.update({
            where: {
                id: survey.id
            },
            data: {
                question: survey.question + 1
            }
        })

        cont = true
    }else if(message.toUpperCase() == "STOP"){
        surveyReturn = await prisma.survey.update({
            where: {
                id: survey.id
            },
            data: {
                question: 8
            }
        })
    } else if(message.toUpperCase() == "REINICIAR"){
        surveyReturn = await prisma.survey.update({
            where: {
                id: survey.id
            },
            data: {
                question: 1
            }
        })
    } 
    
    return [surveyReturn, cont, reply]
}