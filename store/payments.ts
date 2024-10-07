import { type Payment } from "@/types/models"
import { create } from "zustand"

type PaymentsState = {
    payments: Payment[]
}

type PaymentsAction = {
    addPayment: (payment: Payment) => void
}

type PaymentsStore = PaymentsState & PaymentsAction

const MAX_LENGTH = 25

export const createPaymentStore = create<PaymentsStore>((set, get) => ({
    payments: [],
    addPayment: (newPayment) => {
        const curPayments = get().payments
        const exists = curPayments.find(payment => payment.id === newPayment.id)
        if (exists) {
            return curPayments
        }

        const insertAt = curPayments.findIndex(payment => payment.date > newPayment.date)
        const newPayments = [...curPayments]
        if (insertAt < 0) {
           newPayments.push(newPayment) 
        }
        else {
            newPayments.splice(insertAt, 0, newPayment)
        }

        if (newPayments.length > MAX_LENGTH) {
            return newPayments.slice(0, MAX_LENGTH)
        }
        
        return newPayments
    }
}))