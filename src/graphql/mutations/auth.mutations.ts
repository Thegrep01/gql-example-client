import gql from "graphql-tag";

export const SIGN_UP = gql`
  mutation SignUp($login: String!, $password: String!) {
    auth {
      signUp(user: { login: $login, password: $password }) {
        record {
          accessToken
        }
      }
    }
  }
`;
