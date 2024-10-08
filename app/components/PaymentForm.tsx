'use client'
import cloneDeep from "lodash/fp/cloneDeep"
import { useUsers } from "@/hooks/useUsers"
import { Currency, type User } from "@/types/models"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectProps, TextField, Typography } from "@mui/material"
import { useState } from "react"

type NewPayment = {
  receiver?: User,
  sender?: User,
  currency?: Currency,
  amount: string,
  memo: string
}

const EmptyPayment = {
  amount: '',
  memo: ''
}

export const PaymentForm = () => {
  const [newPayment, setNewPayment] = useState<NewPayment>(EmptyPayment)
  const { users } = useUsers()

  function updatePayment (field: string, value: unknown) {
    setNewPayment(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function updateUser (field: string, userId: number) {
    const user = users.find(u => u.id === userId)
    updatePayment(field, cloneDeep(user))
  }

  return (
    <Box>
      <Typography variant="h3">Create a new payment</Typography>
      <div className="py-2 flex">
        <UserSelector
          label="Sender"
          user={newPayment.receiver}
          users={users}
          onChange={e => updateUser('sender', Number(e.target.value))} />
        <div className="flex items-center justify-center px-4">To</div>
        <UserSelector
          label="Receiver"
          user={newPayment.receiver}
          users={users}
          onChange={e => updateUser('receiver', Number(e.target.value))} />
      </div>
      <div className="py-2 flex">
        <TextField
          fullWidth
          id='amount'
          type="number"
          label="Amount"
          value={newPayment.amount}
          onChange={e => updatePayment('amount', e.target.value)} />
        <CurrencySelector value={newPayment.currency ?? ""} onChange={e => updatePayment('currency', e.target.value)} />
      </div>
      <div className="py-2">
        <TextField
          fullWidth
          id='memo'
          label="Memo"
          value={newPayment.memo}
          onChange={e => updatePayment('memo', e.target.value)} />
      </div>
    </Box>
  )
}

type CurrencySelectorProps = {
  value: Currency | "",
  onChange: SelectProps['onChange'],
}

const CurrencySelector = ({ value, onChange }: CurrencySelectorProps) => {
  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel>Currency</InputLabel>
      <Select
        autoWidth
        label="Currency"
        value={value}
        onChange={onChange}
      >
        {Object.keys(Currency).map(currency => <MenuItem key={currency} value={currency}>{currency}</MenuItem>)}
      </Select>
    </FormControl>
  )
}

type UserSelectorProps = {
  user?: User,
  label: string,
  users: User[],
  onChange: SelectProps['onChange']
}

const UserSelector = ({ label, user, users, onChange }: UserSelectorProps) => {
  console.log("Users: ", users)
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={user?.id}
        onChange={onChange}
      >
        {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
      </Select>
    </FormControl>

  )

}