import { GraphQLError } from "graphql";
import { CreateUserArgs } from "../../../../../../models/users";
import redis from "../../../../../utils/redis";
import resend from "../../../../../utils/resend";
import { checkPasswordFormat } from "./checkPasswodFormat";
import { confirmEmailTemplate } from "../emails/confirm-my-email/confirm-my-email";

const bcrypt = require('bcrypt');

export async function generateUsersTokenForRegister(args: CreateUserArgs): Promise<true | GraphQLError>{
    checkPasswordFormat(args.password)

    let passwordHash = await bcrypt.hash(args.password, 10)
   
    const token = Math.random().toString(36).substring(2, 6);

    await redis.setex(token, 1200, JSON.stringify({
        ...args, 
        password: passwordHash,
    }))

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: args.email,
      subject: 'Hello World',
      html: confirmEmailTemplate(token, "/receive-token-for-create-user"),
    });

    if(data.error && data.error.name == 'validation_error') return new GraphQLError("Invalid email", {
      extensions: {
        code: "INVALID"
      }
    })

    return true
}