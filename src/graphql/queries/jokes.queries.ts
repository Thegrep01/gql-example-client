import gql from "graphql-tag";

export const GET_JOKES = gql`
  query GetAllJokes($page: Int, $perPage: Int) {
    allJokes(page: $page, perPage: $perPage) {
      items {
        id
        joke
        author {
          login
        }
      }
      pageInfo {
        page
        perPage
        totalItems
      }
    }
  }
`;
