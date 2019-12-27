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

export const SIGN_IN = gql`
  mutation SignIn($login: String!, $password: String!) {
    auth {
      signIn(user: { login: $login, password: $password }) {
        record {
          accessToken
        }
      }
    }
  }
`;
