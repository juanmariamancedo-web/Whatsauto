const Jwt = require("jsonwebtoken")
require('dotenv').config()
import { GraphQLError } from "graphql"
import { Context } from "../../../../../models/Context"
import { checkPasswordFormat } from "./utils/checkPasswodFormat"
import resend from "../../../../utils/resend"
import redis from "../../../../utils/redis"
import { generateUsersTokenForRegister } from "./utils/generateUsersTokenForRegister"
import { CreateUserArgs } from "../../../../../models/users"
import { forgotMyPassworEmailTemplate } from "./emails/forgot-my-password/forgot-my-password"
import { confirmEmailTemplate } from "./emails/confirm-my-email/confirm-my-email"

const bcrypt = require("bcrypt")

const mutationsLogin = {
    login: async(_parent:any, {emailOrUsername, password}: {emailOrUsername:string, password:string}, {prisma}:Context)=>{
      try {   
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                username: {
                  contains: emailOrUsername
                }
              },
              {
                email: {
                  contains: emailOrUsername
                }
              }
            ]
          }
        })
  
        if (!user) throw new GraphQLError("The username or password is not correct", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        }) 
  
        let match = await bcrypt.compare(password, user.password)
        delete user.password
        
        if(!match) throw new GraphQLError("The username or password is not correct", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        })
  
        return Jwt.sign({ id: user.id, username: user.username}, process.env.SECRET) 
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
      
    },
    sendTokenForCreateFirstUser: async(_root:any, args:CreateUserArgs, {prisma}: Context)=>{
      try {
        let users = await prisma.user.findMany({})
  
        if(users.length > 0) throw new GraphQLError("There is a firt user", {
          extensions: {
            code: "NOFIRSTUSER"
          }
        })
  
        return await generateUsersTokenForRegister({...args, role: "ADMIN"})
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    sendTokenForCreateUser: async(_root:any, args:CreateUserArgs, {currentUser , checkAuthentication, prisma} : Context) =>{
      try {
        
        checkAuthentication(currentUser)
  
        if(currentUser?.role == "EDITOR") throw new GraphQLError('You are not authorized to perform this action.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
  
        if(await prisma.user.findFirst({
          where: {
            username: args.username
          }
        })) throw new GraphQLError("Duplicate username", {
          extensions: {
            code: "DUPLICATE"
          }
        })
  
        if(await prisma.user.findFirst({
          where: {
            AND: [
              { firstName: args.firstName },
              { lastName: args.lastName },
            ]
          }
        })) throw new GraphQLError("Duplicate firstname and lastname", {
          extensions: {
            code: "DUPLICATE"
          }
        })
  
        if(await prisma.user.findFirst({
          where: {
            email: args.email
          }
        })) throw new GraphQLError("Duplicate email", {
          extensions: {
            code: "DUPLICATE"
          }
        })
  
        const resultToken = await generateUsersTokenForRegister(args)
  
        if(resultToken === true) return true
  
        throw resultToken
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    createUser: async(_root:any, {token}:{token:string}, {prisma}: Context)=>{
      try {
        const userData = JSON.parse(await redis.get(token) || "{}")
  
        await redis.del(token)
  
        const user = await prisma.user.create({
          data: userData
        })
  
        await prisma.avatar.create({
          data: {
            userID: user.id,
            style: "initials",
            seed: user.username
          }
        })
  
        return user
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    updateUser: async(_parent:any, args:any, {prisma, currentUser, checkAuthentication, checkToUpdateUser}:Context)=>{
      try {
        
        checkAuthentication(currentUser)
  
        const userID = args.userID? args.userID : currentUser?.id
        await checkToUpdateUser(currentUser, args, userID)
  
        delete args?.userID
  
        const user = await prisma.user.update({
          where: {
            id: userID
          },
          data: {
            ...args
          }
        })
  
        return user
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    updatePassword: async(_root:any, {lastPassword, newPassword}:{lastPassword:string, newPassword:string}, {checkAuthentication, currentUser, prisma}: Context)=>{
      try {
        
        checkAuthentication(currentUser)
  
        const match = await bcrypt.compare(lastPassword, currentUser?.password)
  
        if(!match) throw new GraphQLError("The password is not correct", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        })
  
        checkPasswordFormat(newPassword)
  
        let passwordHash = await bcrypt.hash(newPassword, 10)
  
        return prisma.user.update({
          where: {
            id: currentUser?.id
          },
          data: {
            password: passwordHash
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
    sendKeyForUpdatePassword: async(_root:unknown, {emailOrUsername}: {emailOrUsername:string}, {prisma}: Context)=>{
      try {
        
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                username: {
                  contains: emailOrUsername
                }
              },
              {
                email: {
                  contains: emailOrUsername
                }
              }
            ]
          }
        })
  
        if(!user) throw new GraphQLError('The user was not found', {
          extensions: {
            code: 'NOTFOUND',
          },
        });
  
        const codigo = Math.random().toString(36).substring(2, 6);
  
        await redis.set(codigo, user.id, 'EX', 600);
  
        const data = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: user.email,
          subject: 'Hello World',
          html: forgotMyPassworEmailTemplate(codigo),
        });
  
        if(data.error && data.error.name == 'validation_error') return new GraphQLError("Invalid email", {
          extensions: {
            code: "INVALID"
          }
        })
        
        return true
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    updatePasswordWithKey: async(_root:unknown, {key, newPassword}:{key:string, newPassword:string}, {prisma} :Context)=>{
      try {
        
        const userID = await redis.get(key)
        
        if(!userID) throw new GraphQLError("The key is invalid", {
          extensions: {
            code: "KEYINVALID"
          }
        })
  
        await redis.del(key)
  
        checkPasswordFormat(newPassword)
        
        const passwordHash = await bcrypt.hash(newPassword, 10)
  
        const user = await prisma.user.update({
          where: {
            id: parseInt(userID)
          },
          data: {
            password: passwordHash
          }
        })
  
        if(!user) throw new GraphQLError("The key is invalid", {
          extensions: {
            code: "KEYINVALID"
          }
        })
  
        return user
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    updateAvatar: async(_root:any, {style, seed, userID}:{style:string, seed:string, userID:string}, {prisma, checkAuthentication, currentUser, checkToUpdateUser}: Context)=>{
      try {
        
        checkAuthentication(currentUser)
  
        const id = userID? userID: currentUser?.id
  
        //si el usuario quiere modificar otro y su role es EDITOR salta un error
        if(currentUser?.id !== id && currentUser?.role !== "ADMIN") throw new GraphQLError('You are not authorized to perform this action.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
  
        const avatar = await prisma.avatar.update({
          where: {
            userID: id
          },
          data: {
            style,
            seed
          }
        })
  
        return avatar
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    deleteUser: async(_parent:any, {userID}: {userID:number}, {prisma, currentUser, checkAuthentication}: Context)=>{
      try {
        
        checkAuthentication(currentUser)
  
        if(currentUser?.role !== "ADMIN" && currentUser?.id !== userID) throw new GraphQLError('You are not authorized to perform this action.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
  
        const users = await prisma.user.findMany()
  
        if(users.lenght == 1) throw new GraphQLError('You can not delete the only user.', {
          extensions: {
            code: 'SINGLEUSER',
          },
        });
  
        await prisma.avatar.delete({
          where: {
            userID
          }
        })
        
        const user = await prisma.user.delete({
          where: {
            id: userID
          }
        })
  
        return user
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    sendTokenForUpdateEmail: async(_root:any, {userID, email}: {userID:number, email:string}, {checkAuthentication, currentUser, prisma}: Context)=>{
      try {
        
        checkAuthentication(currentUser)
  
        const id = userID? userID: currentUser?.id
  
        //si el usuario quiere modificar otro y su role es EDITOR salta un error
        if(currentUser?.id !== id && currentUser?.role !== "ADMIN") throw new GraphQLError('You are not authorized to perform this action.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
  
        if(await prisma.user.findFirst({
          where: {
            email
          }
        })) throw new GraphQLError("Duplicate email", {
          extensions: {
            code: "DUPLICATE"
          }
        })
  
        const token = Math.random().toString(36).substring(2, 6);
  
        await redis.setex(token, 1200, JSON.stringify({
          id,
          email
        }))
  
        const data = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: email,
          subject: 'Hello World',
          html: confirmEmailTemplate(token, "/receive-token-for-update-email"),
        });
  
  
        if(data.error && data.error.name == 'validation_error') return new GraphQLError("Invalid email", {
          extensions: {
            code: "INVALID"
          }
        })
  
        return true
      } catch (error) {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        }) 
      }
    },
    updateEmail: async(_root:any, {token}: {token:string}, {prisma}:Context)=>{
      try {
        
        const {id, email} = JSON.parse(await redis.get(token) || "{}") 
        
        if(!id || !email) throw new GraphQLError("Invalid token", {
          extensions: {
            code: "INVALID"
          }
        })
  
        await redis.del(token)
  
        return await prisma.user.update({
          where:{
            id
          },
          data: {
            email
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

export default mutationsLogin