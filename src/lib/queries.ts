import { gql } from "@apollo/client";

// --- 1. PUBLIC STORE QUERIES (Accessible to all visitors) ---

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
    allTags {
      id
      name
      productCount
    }
  }
`;

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

// New Query: Specifically for the Navbar Search functionality
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($searchTerm: String, $categoryName: String) {
    allProducts(search: $searchTerm, categoryName: $categoryName) {
      id
      title
      slug
      totalStock
      price
      category {
        name
      }
      images {
        image
      }
    }
  }
`;

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

export const GET_DAILY_BEST_SELLS = gql`
  query GetDailyBestSells {
    dailyBestSells {
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

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts(
    $categoryName: String, 
    $tagName: String, 
    $minPrice: Float, 
    $maxPrice: Float
  ) {
    allProducts(
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

export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($slug: String!) {
    productBySlug(slug: $slug) {
      id
      title
      slug
      sku
      barcode
      price
      oldPrice
      description
      ingredients
      allergens
      nutritionalInfo
      storageInstructions
      manufacturer
      countryOfOrigin
      productType
      packagingType
      totalStock
      maxOrder
      requiresColdTransport
      category { name }
      brand { name }
      images {
        image
        altText
      }
      tags { name }
    }
  }
`;
// --- 2. PRIVATE USER QUERIES (Filtered automatically by the backend) ---

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      username
      firstName
      lastName
      email
      profile {
        avatar
        bio
        coins
      }
      addresses {
        id
        fullName
        phoneNumber
        county
        estate
        houseNumber
        streetAddress
        isDefault
      }
    }
    myOrders {
      orderNumber
      status
      totalAmount
      createdAt
    }
    activeVouchers {
      code
      discountAmount
      isPercentage
      minPurchaseAmount
      isValidNow
    }
  }
`;

export const GET_TRANSACTION_HISTORY = gql`
  query GetTransactionHistory {
    myTransactions {
      id
      type
      description
      amount
      createdAt
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      orderNumber
      totalAmount
      status
      deliveryStatusDisplay
      paymentStatusDisplay
      createdAt
      items {
        product {
          title
        }
        quantity
        priceAtPurchase
        totalItemPrice
      }
    }
  }
`;

export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($orderNumber: String!) {
    orderByNumber(orderNumber: $orderNumber) {
      id
      orderNumber
      totalAmount
      status
      deliveryStatusDisplay
      createdAt
      shippingAddress {
        estate
        houseNumber
        county
      }
      items {
        product {
          title
        }
        quantity
        priceAtPurchase
      }
    }
  }
`;

// --- 3. MUTATIONS (Actions on the current user's data) ---

export const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($firstName: String, $lastName: String, $bio: String, $isSubscribed: Boolean) {
    updateProfile(firstName: $firstName, lastName: $lastName, bio: $bio, isSubscribed: $isSubscribed) {
      success
      user {
        id
        firstName
        lastName
        profile {
          bio
        }
      }
    }
  }
`;

export const SAVE_ADDRESS = gql`
  mutation SaveAddress(
    $id: ID,
    $fullName: String!,
    $phoneNumber: String!,
    $estate: String!,
    $houseNumber: String!,
    $county: String,
    $streetAddress: String,
    $isDefault: Boolean
  ) {
    saveAddress(
      id: $id,
      fullName: $fullName,
      phoneNumber: $phoneNumber,
      estate: $estate,
      houseNumber: $houseNumber,
      county: $county,
      streetAddress: $streetAddress,
      isDefault: $isDefault
    ) {
      address {
        id
        fullName
        phoneNumber
        estate
        houseNumber
        county
        streetAddress
        isDefault
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($addressId: ID!, $itemsJson: String!) {
    createOrder(addressId: $addressId, itemsJson: $itemsJson) {
      order {
        id
        orderNumber
        totalAmount
      }
    }
  }
`;
export const UPDATE_AVATAR = gql`
  mutation UpdateProfileImage($avatar: Upload!) {
    updateProfileImage(avatar: $avatar) {
      success
      user {
        id
        profile {
          avatar
        }
      }
    }
  }
`;
export const APPLY_VOUCHER = gql`
  mutation ApplyVoucher($code: String!) {
    applyVoucher(code: $code) {
      success
      message
    }
  }
`;