import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation($emailOrUsername: String!, $password: String!){
    login(emailOrUsername: $emailOrUsername, password: $password)
  }
`
export const UPDATE_USER = gql`
  mutation($userId: Int, $username: String, $firstName: String, $lastName: String, $role: Role){
    updateUser (userID: $userId, username: $username, firstName: $firstName, lastName: $lastName, role: $role){
      id
      username
      firstName
      lastName
      role
    }
  }
`

export const UPDATE_AVATAR = gql`
mutation($userId: Int, $style: String, $seed: String){
  updateAvatar (userID: $userId, style: $style, seed: $seed){
    style
    seed
  }
}
`

export const UPDATE_PASSWORD = gql`
  mutation($lastPassword: String!, $newPassword: String!, $userId: Int){
    updatePassword(lastPassword: $lastPassword, newPassword: $newPassword, userID: $userId) {
      id
    }
  }
`

export const CREATE_USER = gql`
mutation($token: String!){
  createUser(token: $token) {
    id
    username
  }
}
`

export const DELETE_USER = gql`
mutation($userId: Int!){
  deleteUser(userID: $userId) {
    id
    username
  }
}
`

export const SEND_TOKEN_FOR_UPDATE_EMAIL = gql`
mutation($email: String!, $userId: Int){
  sendTokenForUpdateEmail(email: $email, userId: $userId)
}`

export const UPDATE_EMAIL = gql`
mutation($token: String!){
  updateEmail(token: $token) {
    id
    email
  }
}`

export const SEND_KEY_FOR_UPDATE_PASSWORD = gql`
mutation($emailOrUsername: String!){
  sendKeyForUpdatePassword(emailOrUsername: $emailOrUsername)
}`

export const UPDATE_PASSWORD_WITH_KEY = gql`
mutation($key: String!, $newPassword: String!){
  updatePasswordWithKey(key: $key, newPassword: $newPassword) {
    id
  }
}`

export const SEND_KEY_FOR_CREATE_USER = gql`
mutation($username: String!, $password: String!, $firstName: String!, $lastName: String!, $email: String!, $role: Role!){
  sendTokenForCreateUser(username: $username, password: $password, firstName: $firstName, lastName: $lastName, email: $email, role: $role)
}`

export const SEND_KEY_FOR_CREATE_FIRST_USER = gql`
mutation($username: String!, $password: String!, $firstName: String!, $lastName: String!, $email: String!){
  sendTokenForCreateFirstUser(username: $username, password: $password, firstName: $firstName, lastName: $lastName, email: $email)
}`