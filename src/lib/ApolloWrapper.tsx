"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";

const link = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:8000/graphql/",
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};