'use client'
import { getPayments } from "@/api/payments";
import { createPaymentsStore, type PaymentsStore } from "@/store/payments";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

type PaymentsStoreApi = ReturnType<typeof createPaymentsStore>

const PaymentsStoreContext = createContext<PaymentsStoreApi | undefined>(
  undefined,
)

interface PaymentsStoreProviderProps {
  children: ReactNode
}

export const PaymentsStoreProvider = ({
  children
}: PaymentsStoreProviderProps) => {
  const storeRef = useRef<PaymentsStoreApi>()

  useEffect(() => {
    async function fetchPayments(addPayment: PaymentsStore['addPayment']) {
      try {
        const { data } = await getPayments()
        addPayment(data.data)
      } catch (err) {
        // handle error
        console.error(err)
      }
    }

    let timer: NodeJS.Timeout

    function recursiveFetchPayments() {
      if (storeRef.current) {
        const addPayment = storeRef.current.getState().addPayment
        fetchPayments(addPayment)
      }
      timer = setTimeout(() => {
        recursiveFetchPayments()
      }, 1000)
    }

    recursiveFetchPayments()

    return () => {
      clearTimeout(timer)
    }
  }, [])


  if (!storeRef.current) {
    storeRef.current = createPaymentsStore()
  }

  return (
    <PaymentsStoreContext.Provider value={storeRef.current}>
      {children}
    </PaymentsStoreContext.Provider>
  )
}

export const usePaymentsStore = <T,> (
  selector: (store: PaymentsStore) => T
): T => {
  const paymentsStoreContext = useContext(PaymentsStoreContext)

  if (!paymentsStoreContext) {
    throw new Error(`usePaymentsStore must be used within PaymentsStoreProvider`)
  }

  return useStore(paymentsStoreContext, selector)
}