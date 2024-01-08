import { getCurrentUser, isRequest } from "../../../utils/currentUser";
import express = require('express');
import { GraphQLError } from "graphql";
import { User } from "../../../../models/users";
import { Context } from "../../../../models/Context";
import prisma from "../../../utils/prisma";

function checkAuthentication(currentUser:User | undefined): void{
    if(!currentUser) throw new GraphQLError("The user is not login", {
      extensions: {
        code: "UNAUTHENTICATED"
      }
    })
  }
  
  async function checkToUpdateUser(currentUser:User | undefined, args: any, userID:number){
    if(currentUser?.role == "EDITOR" && (currentUser?.id !== userID || args.role == "ADMIN")) throw new GraphQLError('You are not authorized to perform this action.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  
    const users = await prisma.user.findMany({
      where: {
        role: "ADMIN"
      }
    })
  
    if(currentUser?.role == "ADMIN" && args.role == "EDITOR" && currentUser?.id == userID && users.length == 1) throw new GraphQLError('You can not change your role because you are the single ADMIN.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

export default async function context({req, res}: {req:express.Request, res:express.Response}):Promise<Context>{
  let currentUser: User | undefined
  
  if(isRequest(req)){
    currentUser = await getCurrentUser(req.get("authorization"))
  }

  return ({
    currentUser,
    checkAuthentication,
    checkToUpdateUser,
    prisma
  })    
}
