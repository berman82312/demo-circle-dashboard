import { type Payment } from "@/types/models";
import { api } from "./base";

export function getPayments() {
    return api.get<{data: Payment}>('/payments')
}

export function createPayment(payload: Payment) {
    return api.post('/payments', payload)
}