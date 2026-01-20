"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";

// 1. Explicitly define the link to your Django Backend
const link = new HttpLink({
  uri: "http://localhost:8000/graphql/",
});

// 2. Initialize the client with the link and cache
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};