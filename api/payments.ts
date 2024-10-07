import { Payment } from "@/types/models";
import { api } from "./base";

export function getPayments() {
    return api.get('/payments')
}

export function createPayment(payload: Payment) {
    return api.post('/payments', payload)
}