import gql from "graphql-tag";

export const ADD_JOKE = gql`
  mutation CreateJoke($joke: String!) {
    jokes {
      createJoke(joke: $joke) {
        error
        recordId
      }
    }
  }
`;
