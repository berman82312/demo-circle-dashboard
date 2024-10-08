export type User = {
  id: number,
  name: string
}

export const Currency = {
  BTC: 'BTC',
  GBP: 'GBP',
  EUR: 'EUR',
  JPY: 'JPY',
  USD: 'USD'
} as const

export type Currency = (typeof Currency)[keyof typeof Currency] 


export type Payment = {
  id: string,
  date: string,
  sender: User,
  receiver: User,
  amount: string,
  currency: Currency,
  memo: string
}