"use client";

import { ReactNode, useMemo } from "react";
// Split the imports to help Turbopack find the right modules
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => {
    // Use environment variable which is set at build time per environment
    const uri =
      process.env.NEXT_PUBLIC_GRAPHQL_URI ||
      "https://utamu-wetu-back.onrender.com/graphql/";

    const httpLink = createHttpLink({
      uri,
    });

    const authLink = setContext((_, { headers }) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      return {
        headers: {
          ...headers,
          authorization: token ? `JWT ${token}` : "",
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
