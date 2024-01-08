import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    filterSurveysForRangeDate(fechaInicio: String!, fechaFin: String!): [Survey]
    paginationUsers(page: Int, docs: Int): PaginationUsers!
    
    getUser(userID: Int!): User!
    me: User!

    countOfAdmins: Int!
  }

  type Mutation {
    login(emailOrUsername: String!, password: String!): String!

    sendTokenForCreateFirstUser(username: String!, password: String!, firstName: String!, lastName: String!, email: String!): Boolean!
    sendTokenForCreateUser(username: String!, password: String!, firstName: String!, lastName: String!, email: String!, role: Role!): Boolean!
    createUser(token: String!): User!
    
    updateUser(userID: Int, username: String, password: String, firstName: String, lastName: String, role: Role): User!
    updatePassword(lastPassword: String!, newPassword: String!): User!
    updateAvatar(userID: Int, style: String, seed: String): Avatar
    
    sendKeyForUpdatePassword(emailOrUsername: String!): Boolean!
    updatePasswordWithKey(key: String!, newPassword: String!): User!

    sendTokenForUpdateEmail(userId: Int, email: String!): Boolean!
    updateEmail(token: String!): User!

    deleteUser(userID: Int!): User!
  }

  enum Role{
    ADMIN
    EDITOR
  }

  type User {
    id:    Int!
    username: String!
    firstName:  String!
    lastName: String!
    email: String!
    role: String!
    avatar: Avatar!
  }

  type Avatar{
    id: Int!
    style: String!
    seed: String!
  }

  type Survey{
    id: Int!
    createdAt: String!
    question: Int!
    firstQuestion: String
    secondQuestion: String
    thirdQuestion: String
    fourthQuestion: String
    fifthQuestion: String
    sixthQuestion: String
    seventhQuestion: String
    comentaries: String
    chat: Chat
  }

  type Chat {
    id: Int!
    phone: String!
  }

  type Pagination {
    totalDocs: Int!
    totalPages: Int!
    page: Int!
  }

  type PaginationUsers {
    data: [User]
    pagination: Pagination!
  }
`;

export default typeDefs