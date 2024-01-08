import { gql } from "@apollo/client";

export const GET_SURVEYS_BETWEEN_TWO_DATES = gql`
query($fechaInicio: String!, $fechaFin: String!){
    filterSurveysForRangeDate(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      id
      createdAt
      firstQuestion
      secondQuestion
      thirdQuestion
      fourthQuestion
      fifthQuestion
      sixthQuestion
      seventhQuestion
      comentaries
      chat {
        phone
      }
    }
  }
`

export const GET_PROFILE = gql`
  query{
    profile: me {
      id
      username
      firstName
      lastName
      email
      role
      avatar {
        id
        seed
        style
      }
    }
  }
`

export const GET_COUNT_OF_ADMINS = gql`
  query{
    countOfAdmins
  }
`

export const CREATE_FIRST_USER = gql`
  mutation($username: String!, $password: String!, $firstName: String!, $lastName: String!, $email: String!){
    createFirstUser(username: $username, password: $password, firstName: $firstName, lastName: $lastName, email: $email) {
      username
    }
  }
`

export const GET_USERS = gql`
query($page: Int){
  paginationUsers(page: $page) {
    data {
      id
      username,
      avatar {
        id
        style
        seed
      }
    }
    pagination {
      page
      totalPages
    }
  }
}`

export const GET_USER = gql`
query($userId: Int!){
  profile: getUser(userID: $userId) {
    id
    username
    email
    firstName
    lastName
    avatar {
      style
      seed
    }
  }
}`