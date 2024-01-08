import { ApolloServer, gql } from "apollo-server-express";
import usersQueries from "./user/queries";
import quieriesSurvey from "./survey/queries";
import subQuieriesSurvey from "./survey/subQueries";
import mutationsLogin from "./user/mutations";
import context from "./context";
import subQueriesUser from "./user/subQueries";
import typeDefs from "./typeDefs";

const resolvers = {
    Query: {
        ...quieriesSurvey,
        ...usersQueries
    },
    Mutation: {
      ...mutationsLogin
    },
    Survey: {
        ...subQuieriesSurvey
    },
    User: {
      ...subQueriesUser
    }
}

// Crear una instancia de Apollo Server
const Graphql = new ApolloServer({ typeDefs, resolvers, introspection: true, context });

export default Graphql