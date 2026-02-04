import { gql } from "@apollo/client";

export const INITIATE_STK_PUSH = gql`
  mutation InitiateStkPush($amount: Float!) {
    initiateStkPush(amount: $amount) {
      success
      message
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($provider: String!, $accountNumber: String!) {
    addPaymentMethod(provider: $provider, accountNumber: $accountNumber) {
      success
      message
      paymentMethod {
        id
        provider
        accountNumber
      }
    }
  }
`;
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($firstName: String, $lastName: String, $phone: String) {
    updateUserProfile(firstName: $firstName, lastName: $lastName, phone: $phone) {
      success
      message
      user {
        id
        firstName
        lastName
        phone
      }
    }
  }
`;