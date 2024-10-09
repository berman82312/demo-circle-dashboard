import { useState } from "react"
import { Search } from "@mui/icons-material"
import { FormControlLabel, IconButton, Switch, TextField } from "@mui/material"
import { usePaymentsStore } from "@/hooks/usePaymentsStore"
import { objectContainsKeyword } from "@/utils/objectContains"
import { type Payment } from "@/types/models"
import { PaymentItem } from "./PaymentItem"

const hasKeyword = (keyword: string) => (payment: Payment) => {
  return objectContainsKeyword(payment, keyword.toLowerCase())
}

export const RecentPayments = () => {
  const payments = usePaymentsStore(state => state.payments)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState({
    showMemo: false,
    showDate: true
  })

  const filteredPayments = !!search ? payments.filter(hasKeyword(search)) : payments

  function updateStatus(field: string, value: unknown) {
    setStatus(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
      <TextField
        fullWidth
        label="Search"
        slotProps={{
          input: {
            endAdornment: <IconButton><Search /></IconButton>
          }
        }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div>
        <FormControlLabel
          label="Show memo"
          control={
            <Switch
              checked={status.showMemo}
              onChange={e => updateStatus('showMemo', e.target.checked)} />
          }
        />
        <FormControlLabel
          label="Show date"
          control={
            <Switch
              checked={status.showDate}
              onChange={e => updateStatus('showDate', e.target.checked)} />
          }
        />
      </div>
      {filteredPayments.map(payment => <PaymentItem payment={payment} showDate={status.showDate} showMemo={status.showMemo} key={payment.id} />)}
    </>
  )
}
