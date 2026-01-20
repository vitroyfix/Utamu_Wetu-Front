import { gql } from "@apollo/client";

// 1. Fetch Categories for the filter tabs
export const GET_CATEGORIES = gql`
  query GetCategories {
    allCategories {
      id
      name
      image
    }
  }
`;

// 2. Fetch Independent Lifestyle/Showcase Assets
export const GET_SHOWCASE_ASSETS = gql`
  query GetShowcaseAssets {
    allShowcases {
      id
      title
      subtitle
      image
      isActive
      linkUrl
    }
  }
`;

// 3. Fetch Popular Products (Main Grid) - Updated with Best Seller fields
export const GET_POPULAR_PRODUCTS = gql`
  query GetPopularProducts($categoryName: String) {
    popularProducts(categoryName: $categoryName) {
      id
      title
      price
      oldPrice
      isHotDeal
      isBestSeller
      soldCount
      totalStock
      category { name }
      brand { name }
      weight { value unit }
      images {
        image
      }
    }
  }
`;

// 4. Fetch Deals of the Day - Updated with Best Seller fields
export const GET_DEALS_OF_THE_DAY = gql`
  query GetDeals {
    dealsOfTheDay {
      id
      title
      price
      oldPrice
      isHotDeal
      isBestSeller
      soldCount
      totalStock
      category {
        name
      }
      brand {
        name
      }
      images {
        image
      }
    }
  }
`;