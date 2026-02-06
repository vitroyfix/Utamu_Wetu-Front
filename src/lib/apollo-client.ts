import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// 1. Determine the Backend URI
// Uses NEXT_PUBLIC_GRAPHQL_URI env var that's set per environment (.env.local vs .env.production)
const getBaseUri = () => {
  // Use the environment variable which is set at build time
  return (
    process.env.NEXT_PUBLIC_GRAPHQL_URI ||
    "https://utamu-wetu-back.onrender.com/graphql/"
  );
};

const httpLink = createHttpLink({
  uri: getBaseUri(),
});

// 2. Authentication Middleware
// This automatically grabs your JWT token from the browser and sends it to Django
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

//

const client = new ApolloClient({
  link: authLink.concat(httpLink), // Merges Auth + Connection
  cache: new InMemoryCache(),
});

export default client;
