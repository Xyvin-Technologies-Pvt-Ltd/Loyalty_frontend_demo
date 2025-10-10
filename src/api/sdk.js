import axios from "axios";
import { useAuthUser } from "../hooks/useAuthUser";

// const sdkUrl = "http://13.127.95.200/api/v1";
const sdkUrl = "http://localhost:3002/api/v1";

const sdkApiClient = axios.create({
  baseURL: sdkUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

function getAuth() {
  const { customerId, apiKey } = useAuthUser.getState();
  if (!customerId || !apiKey) {
    throw new Error("Missing customer credentials in store");
  }
  return { customerId, apiKey };
}

const sdkApi = {
  // ✅ Get customer details
  getCustomerDetails: async () => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/customer",
        { customer_id: customerId },
        { headers: { "x-api-key": apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer details:", error);
      throw error;
    }
  },

  // ✅ Get transaction history
  getTransactionHistory: async (page = 1, limit = 20) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/transaction-history",
        { customer_id: customerId, page, limit },
        { headers: { "x-api-key": apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching transaction history:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ Add points
  addPoints: async (transactionData) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/add-points",
        { customer_id: customerId, ...transactionData },
        { headers: { "x-api-key": apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding points:", error);
      throw error;
    }
  },

  // ✅ Redeem points
  redeemPoints: async (redemptionData) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/redeem-points",
        { customer_id: customerId, ...redemptionData },
        { headers: { "x-api-key": apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error("Error redeeming points:", error);
      throw error;
    }
  },

  // ✅ Get merchant offers
  getMerchantOffers: async (params = {}) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.get(
        "/khedmah-sdk/get-merchant-offers",
        {
          params: { customer_id: customerId, ...params },
          headers: { "x-api-key": apiKey },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching merchant offers:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ Get brands
  getBrands: async (params = {}) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.get("/khedmah-sdk/get-brands", {
        params: { customer_id: customerId, ...params },
        headers: { "x-api-key": apiKey },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching brands:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getCategories: async (params = {}) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.get("/khedmah-sdk/get-categories", {
        params: { customer_id: customerId, ...params },
        headers: { "x-api-key": apiKey },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getCouponId: async (id, params = {}) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.get(
        `/khedmah-sdk/get-coupon-details/${id}`,
        {
          params: { customer_id: customerId, ...params },
          headers: { "x-api-key": apiKey },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching coupon details:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  addRedeem: async (redemptionData) => {
    const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/redeem-coupon",
        { customer_id: customerId, ...redemptionData },
        { headers: { "x-api-key": apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error redeeming coupon:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  customerLogin: async (data) => {
    const { customerId, apiKey } = getAuth();
console.log(data,"data");
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/customer-login",
        data, // ✅ backend expects flat body { phone, mpin? }
        {
          headers: { "x-api-key": apiKey },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error in customer login:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  /**
   * 🔐 OTP Verification
   * Backend: /khedmah-sdk/otp-verification
   * Payload: { phone, otp }
   */
  otpVerification: async (data) => {
      const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/otp-verification",
        data,
        {
          headers: { "x-api-key": apiKey },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error verifying OTP:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  /**
   * 🔑 Add / Set MPIN
   * Backend: /khedmah-sdk/add-mpin
   * Payload: { phone, mpin }
   */
  addMpin: async (data) => {
      const { customerId, apiKey } = getAuth();
    try {
      const response = await sdkApiClient.post(
        "/khedmah-sdk/add-mpin",
        data,
        {
          headers: { "x-api-key": apiKey },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error adding MPIN:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },
};

export default sdkApi;
