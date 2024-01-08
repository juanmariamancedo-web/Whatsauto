import { GraphQLError } from "graphql";

export function checkPasswordFormat(password:string){
    const contrasenaRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    if(!contrasenaRegex.test(password)) throw new GraphQLError("Invalid password format", {
      extensions: {
        code: "INVALIDPASSWORDFORMAT"
      }
    })
  }