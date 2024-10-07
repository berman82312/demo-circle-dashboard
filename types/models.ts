export type User = {
  id: number,
  name: string
}

export type Payment = {
  id: string,
  date: string,
  sender: User,
  receiver: User,
  amount: string,
  currency: 'BTC' | 'GBP' | 'EUR' | 'JPY' | 'USD',
  memo: string
}