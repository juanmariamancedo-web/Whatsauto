import prisma from "./prisma"
import { type Survey } from "@prisma/client"

export default async function getSurvey(phone:string): Promise<Survey>{
    let chat 
    chat = await prisma.chat.findFirst({
      where: {
        phone
      }
    })

    if(!chat) chat = await prisma.chat.create({
      data: {
        phone
      }
    })

    let survey
    survey = await prisma.survey.findMany({
      where: {
        chatId: chat.id
      }
    })

    survey = survey[survey.length - 1]

    if(!survey || survey.question == 9){
      survey = await prisma.survey.create({
        data: {
          chatId: chat.id, 
          question: 0
        }
      })
    }

    return survey
}