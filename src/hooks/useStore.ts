import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../lib/queries";

export const usePopularProducts = (categoryName: string) => {
  const { data, loading, error } = useQuery(GET_POPULAR_PRODUCTS, {
    variables: { 
      categoryName: !categoryName || categoryName === "All" ? null : categoryName,
      maxPrice: 10000 
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network", // Optional: fetch from cache first, then network
  });

  const products = data?.popularProducts || [];

  return {
    products,
    loading,
    hasProducts: products.length > 0,
    error,
  };
};