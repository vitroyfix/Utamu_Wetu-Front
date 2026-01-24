import { gql } from "@apollo/client";


export const GET_CATEGORIES = gql`
  query GetCategories {
    allCategories {
      id
      name
      image
      slug
      maxPrice
      productCount
    }
    allWeights {
      id
      value
      unit
      productCount 
    }
    # Added dynamic tags for the Product Tags section
    allTags {
      id
      name
      productCount
    }
  }
`;

// Fetch Independent Lifestyle/Showcase Assets
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

// Fetch Popular Products (Updated with Tag and Price filtering)
export const GET_POPULAR_PRODUCTS = gql`
  query GetPopularProducts(
    $categoryName: String, 
    $tagName: String, 
    $minPrice: Float, 
    $maxPrice: Float
  ) {
    popularProducts(
      categoryName: $categoryName, 
      tagName: $tagName, 
      minPrice: $minPrice, 
      maxPrice: $maxPrice
    ) {
      id
      title
      slug
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
        id
        image
      }
    }
  }
`;

// Fetch Deals of the Day 
export const GET_DEALS_OF_THE_DAY = gql`
  query GetDeals {
    dealsOfTheDay {
      id
      title
      slug
      price
      oldPrice
      isHotDeal
      isBestSeller
      soldCount
      totalStock
      category { name }
      brand { name }
      images { 
        id
        image 
      }
    }
  }
`;

// Fetch Single Product Details by Slug
export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($slug: String!) {
    productBySlug(slug: $slug) {
      id
      title
      slug
      sku
      barcode
      description
      price
      oldPrice
      soldCount
      totalStock
      productType
      packagingType
      minOrder
      maxOrder 
      ingredients
      nutritionalInfo
      allergens
      storageInstructions
      shelfLife
      expiryInfo
      countryOfOrigin
      manufacturer
      processingMethod
      qualityCertification
      requiresColdTransport
      sameDayDelivery
      category { 
        name 
      }
      brand { 
        name 
      }
      weight { 
        value 
        unit 
      }
      images {
        id
        image
        altText
      }
      tags {
        name
      }
    }
  }
`;