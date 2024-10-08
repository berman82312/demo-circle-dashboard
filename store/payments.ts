import { type Payment } from "@/types/models"
import { createStore } from "zustand"

type PaymentsState = {
  payments: Payment[]
}

type PaymentsAction = {
  addPayment: (payment: Payment) => void
}

export type PaymentsStore = PaymentsState & PaymentsAction

const MAX_LENGTH = 25

export const createPaymentsStore = () => {
  return createStore<PaymentsStore>()((set, get) => ({
    payments: [],
    addPayment: (newPayment) => {
      const curPayments = get().payments
      const exists = curPayments.find(payment => payment.id === newPayment.id)
      if (exists) {
        return curPayments
      }

      const insertAt = curPayments.findIndex(payment => payment.date < newPayment.date)
      const newPayments = [...curPayments]
      if (insertAt < 0) {
        newPayments.push(newPayment)
      }
      else {
        newPayments.splice(insertAt, 0, newPayment)
      }

      set({
        payments: newPayments.length > MAX_LENGTH ? newPayments.slice(0, MAX_LENGTH) : newPayments
      })
    }
  }))
}