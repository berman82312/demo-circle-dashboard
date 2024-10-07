'use client'
import { useEffect } from "react";
import { getPayments } from "@/api/payments";
import { usePaymentStore } from "@/store/payments";
import { RecentPayments } from "./components/RecentPayments";

export default function Home() {
  const addPayment = usePaymentStore(state => state.addPayment)

  useEffect(() => {
    async function fetchPayments() {
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
      fetchPayments()
      timer = setTimeout(() => {
        recursiveFetchPayments()
      }, 1000)
    }

    recursiveFetchPayments()

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Recent payments</p>
        <RecentPayments />
      </main>
    </div>
  );
}
