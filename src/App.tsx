import React from "react";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LoginForm } from "./app/login/Login";
import { RegisterForm } from "./app/register/Register";
import { Main } from "./app/main/Main";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, Observable } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { typeDefs, resolvers, CHECK_LOGGED_STATUS } from "./graphql/local";
const cache = new InMemoryCache();

const request = async (operation: any) => {
  if (
    operation.operationName !== "SignIn" &&
    operation.operationName !== "SignUp"
  ) {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    });
  }
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle: any;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors }) => {
      const msg = graphQLErrors && (graphQLErrors[0].message as any);
      if (msg.statusCode === 401) {
        localStorage.clear();
        const data = { isLoggedIn: false };
        cache.writeData({ data });
      }
    }),
    requestLink,
    new HttpLink({
      uri: "http://localhost:8080/graphql"
    })
  ]),
  cache,
  typeDefs,
  resolvers
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token")
  }
});

function ProtectedRoute({ component: Component }: any) {
  const { loading, data } = useQuery(CHECK_LOGGED_STATUS);

  return (
    <Route
      path="/"
      render={routeProps => {
        return !loading && !data.isLoggedIn ? (
          <LoginForm />
        ) : (
          <Component {...routeProps} />
        );
      }}
    />
  );
}

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <ProtectedRoute component={Main} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
