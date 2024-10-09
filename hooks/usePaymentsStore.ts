'use client'
import { useContext } from "react";
import { useStore } from "zustand";
import { type PaymentsStore } from "@/store/payments";
import { PaymentsStoreContext } from "../context/PaymentsStoreProvider";

export const usePaymentsStore = <T,> (
  selector: (store: PaymentsStore) => T
): T => {
  const paymentsStoreContext = useContext(PaymentsStoreContext)

  if (!paymentsStoreContext) {
    throw new Error(`usePaymentsStore must be used within PaymentsStoreProvider`)
  }

  return useStore(paymentsStoreContext, selector)
}