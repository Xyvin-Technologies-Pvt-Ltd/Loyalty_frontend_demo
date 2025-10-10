import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthUser = create(
  persist(
    (set) => ({
      customerId: null,
      apiKey: null,
      setCustomerAuth: ({ customerId, apiKey }) => set({ customerId, apiKey }),
      clearCustomerAuth: () => set({ customerId: null, apiKey: null }),
    }),
    {
      name: "customer-auth", 
    }
  )
);
