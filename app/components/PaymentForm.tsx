'use client'
import cloneDeep from "lodash/fp/cloneDeep"
import { useUsers } from "@/hooks/useUsers"
import { Currency, type User } from "@/types/models"
import { Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectProps, TextField, Typography } from "@mui/material"
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

const InitStatus = {
  isLoading: false,
  isStrictValidation: false
}

export const PaymentForm = () => {
  const [newPayment, setNewPayment] = useState<NewPayment>(EmptyPayment)
  const [status, setStatus] = useState(InitStatus)
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

  function validateReceiver (isStrict: boolean) {
    if (isStrict && !newPayment.receiver) {
      return "Receiver cannot be empty"
    }

    if (!newPayment.receiver) {
      return
    }

    if (newPayment.receiver?.id === newPayment.sender?.id) {
      return "Sender and receiver must be different"
    }
  }

  function validateSender (isStrict: boolean) {
    if (isStrict && !newPayment.sender) {
      return "Sender cannot be empty"
    }

    if (!newPayment.sender) {
      return
    }

    if (newPayment.receiver?.id === newPayment.sender?.id) {
      return "Sender and receiver must be different"
    }
  }

  function validateAmount (isStrict: boolean) {
    if (isStrict && !newPayment.amount) {
      return "Amount cannot be empty"
    }

    if (!newPayment.amount) {
      return
    }

    const amount = Number(newPayment.amount)

    if (Number.isNaN(amount)) {
      return "Invalid amount"
    }

    if (amount <= 0) {
      return "Amount need to be greater than 0"
    }
  }

  function validateCurrency (isStrict: boolean) {
    if (isStrict && !newPayment.currency) {
      return "Must select a currency"
    }
  }

  function validateAll() {
    const hasError = validateSender(true) || validateReceiver(true) || validateAmount(true) || validateCurrency(true)
    return !!hasError
  }

  const errors = {
    sender: validateSender(status.isStrictValidation),
    receiver: validateReceiver(status.isStrictValidation),
    amount: validateAmount(status.isStrictValidation),
    currency: validateCurrency(status.isStrictValidation),
  }

  function onCancel () {
    setNewPayment(EmptyPayment)
    setStatus(InitStatus)
  }

  function onSubmit () {
    if (!status.isStrictValidation) {
      setStatus(prev => ({
        ...prev,
        isStrictValidation: true
      }))
    }

    const hasError = validateAll() 
    
    if (hasError) {
      return
    }

    setStatus(prev => ({
      ...prev,
      isLoading: true
    }))
  }

  return (
    <Box>
      <Typography variant="h3">Create a new payment</Typography>
      <div className="py-2 flex">
        <UserSelector
          error={errors.sender}
          label="Sender"
          user={newPayment.sender}
          users={users}
          onChange={e => updateUser('sender', Number(e.target.value))} />
        <div className="flex items-center justify-center px-4">To</div>
        <UserSelector
          error={errors.receiver}
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
          slotProps={{
            htmlInput: {
              min: 0
            }
          }}
          onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
          onChange={e => updatePayment('amount', e.target.value)}
          error={!!errors.amount}
          helperText={errors.amount} />
        <CurrencySelector
          value={newPayment.currency ?? ""}
          onChange={e => updatePayment('currency', e.target.value)}
          error={errors.currency} />
      </div>
      <div className="py-2">
        <TextField
          fullWidth
          id='memo'
          label="Memo"
          value={newPayment.memo}
          onChange={e => updatePayment('memo', e.target.value)} />
      </div>
      <div className="py-2 flex justify-between">
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        <Button variant="contained" disabled={status.isLoading} onClick={onSubmit}>
          {status.isLoading ? <CircularProgress size={'2rem'} /> : 'Submit'}
        </Button>
      </div>
    </Box>
  )
}

type CurrencySelectorProps = {
  value: Currency | "",
  onChange: SelectProps['onChange'],
  error?: string
}

const CurrencySelector = ({ value, onChange, error }: CurrencySelectorProps) => {
  const hasError = !!error
  return (
    <FormControl sx={{ minWidth: 120 }} error={hasError}>
      <InputLabel>Currency</InputLabel>
      <Select
        autoWidth
        label="Currency"
        value={value}
        onChange={onChange}
      >
        {Object.keys(Currency).map(currency => <MenuItem key={currency} value={currency}>{currency}</MenuItem>)}
      </Select>
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

type UserSelectorProps = {
  user?: User,
  error?: string,
  label: string,
  users: User[],
  onChange: SelectProps['onChange']
}

const UserSelector = ({ label, user, users, onChange, error }: UserSelectorProps) => {
  const hasError = !!error
  return (
    <FormControl fullWidth error={hasError}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={user?.id}
        onChange={onChange}
      >
        {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
      </Select>
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}