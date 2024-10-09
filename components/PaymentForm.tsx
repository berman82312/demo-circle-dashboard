import { useEffect, useState } from "react"
import axios from "axios"
import cloneDeep from "lodash/fp/cloneDeep"
import {
  Box,
  Button,
  CircularProgress,
  Grow,
  TextField,
  Typography
} from "@mui/material"
import { useNotifications } from "@toolpad/core"
import { createPayment } from "@/api/payments"
import { CurrencySelector } from "@/components/CurrencySelector"
import { UserSelector } from "@/components/UserSelector"
import { usePaymentsStore } from "@/hooks/usePaymentsStore"
import { useUsers } from "@/hooks/useUsers"
import { Currency, Payment, type User } from "@/types/models"

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
  show: true,
  isLoading: false,
  isStrictValidation: false
}

type PaymentFormProps = {
  onCancel: () => void,
  onSubmit: (payment: Payment) => void
}

export const PaymentForm = (props: PaymentFormProps) => {
  const [newPayment, setNewPayment] = useState<NewPayment>(EmptyPayment)
  const [status, setStatus] = useState(InitStatus)
  const { users } = useUsers()
  const notifications = useNotifications()
  const addPayment = usePaymentsStore(state => state.addPayment)

  useEffect(() => {
    let timer: NodeJS.Timeout

    function handleError(message: string, err?: unknown) {
      notifications.show(message, {
        autoHideDuration: 3000,
        severity: 'error'
      })
      if (err) {
        console.error("Payment form error", err)
      }
    }

    async function tryCreatePayment(payload: Payment) {
      try {
        const response = await createPayment(payload)
        if (response.status === 201) {
          const payment = Object.assign({}, cloneDeep(payload), { createdByUser: true })
          addPayment(payment)
          notifications.show('Payment created', {
            severity: 'success',
            autoHideDuration: 3000
          })
          resetForm(() => props.onSubmit(payment))
        }
        else {
          handleError(`Unknown response status: ${response.status}`)
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 503) {
            // Flaky server, auto retry
            timer = setTimeout(() => {
              tryCreatePayment(payload)
            }, 1000)
          }
          else {
            handleError(`Unexpected server error: ${err.message}`, err)
          }
        }
        else {
          handleError(`Failed to create payment`, err)
        }
      }
    }

    function getPayload(): Payment {
      return {
        id: Math.round(Math.random() * 1e16).toString(),
        date: new Date().toISOString(),
        sender: cloneDeep(newPayment.sender!),
        receiver: cloneDeep(newPayment.receiver!),
        amount: Number(newPayment.amount).toString(),
        currency: newPayment.currency!,
        memo: newPayment.memo
      }
    }

    if (status.isLoading) {
      const payload = getPayload()
      tryCreatePayment(payload)
    }

    return () => {
      clearTimeout(timer)
    }

  }, [status.isLoading, addPayment])

  function updatePayment(field: string, value: unknown) {
    setNewPayment(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function updateUser(field: string, userId: number) {
    const user = users.find(u => u.id === userId)
    updatePayment(field, cloneDeep(user))
  }

  function validateReceiver(isStrict: boolean) {
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

  function validateSender(isStrict: boolean) {
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

  function validateAmount(isStrict: boolean) {
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

  function validateCurrency(isStrict: boolean) {
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

  function resetForm(cb: () => void) {
    setNewPayment(EmptyPayment)
    setStatus({
      ...InitStatus,
      show: false
    })
    setTimeout(() => {
      cb()
    }, 700)
  }

  function onCancel() {
    resetForm(props.onCancel)
  }

  function onSubmit() {
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
    <Grow in={status.show} timeout={500}>
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
          {status.isLoading ? null : <Button variant="outlined" onClick={onCancel}>Cancel</Button>}
          <Button variant="contained" disabled={status.isLoading} onClick={onSubmit}>
            {status.isLoading ? <CircularProgress size={'2rem'} /> : 'Submit'}
          </Button>
        </div>
      </Box>
    </Grow>
  )
}
