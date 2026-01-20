import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../lib/queries";

export const usePopularProducts = (categoryName: string) => {
  const { data, loading, error } = useQuery(GET_POPULAR_PRODUCTS, {
    variables: { categoryName },
  });

  return {
    products: data?.popularProducts || [],
    loading,
    error,
  };
};