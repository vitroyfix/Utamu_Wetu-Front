import { useQuery } from "@apollo/client/react";
import { GET_POPULAR_PRODUCTS } from "../lib/queries";

// Define the shape of the product and the query result
interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  // Add other fields you use in the UI
}

interface PopularProductsData {
  popularProducts: Product[];
}

export const usePopularProducts = (categoryName: string) => {
  // Pass the interface to useQuery so TypeScript knows what 'data' contains
  const { data, loading, error } = useQuery<PopularProductsData>(GET_POPULAR_PRODUCTS, {
    variables: { 
      categoryName: !categoryName || categoryName === "All" ? null : categoryName,
      maxPrice: 10000 
    },
    notifyOnNetworkStatusChange: true,
  });

  const products = data?.popularProducts || [];

  return {
    products,
    loading,
    hasProducts: products.length > 0,
    error,
  };
};