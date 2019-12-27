import React from "react";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LoginForm } from "./app/login/Login";
import { RegisterForm } from "./app/register/Register";
import { typeDefs } from "./graphql/local/schema";
import { resolvers } from "./graphql/local/resolvers";
import { GET_IS_LOGGED } from "./graphql/local/queries";
const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache,
  typeDefs,
  resolvers
});

function ProtectedRoute({ component: Component }: any) {
  const { loading, data } = useQuery(GET_IS_LOGGED);

  return (
    <Route
      path="/"
      render={routeProps => {
        return !loading && !data.isLogged ? (
          <LoginForm />
        ) : (
          <Component {...routeProps} />
        );
      }}
    />
  );
}

const Tmp = () => <h1>A</h1>;

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <ProtectedRoute component={Tmp} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
