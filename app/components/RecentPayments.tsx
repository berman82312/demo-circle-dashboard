'use client'
import { usePaymentsStore } from "@/hooks/usePaymentsStore"
import { type Payment } from "@/types/models"
import { Search } from "@mui/icons-material"
import { Card, CardContent, Chip, FormControlLabel, Grow, IconButton, Switch, TextField, Typography } from "@mui/material"
import { useState } from "react"

const valueContains = (target: Object, keyword: string) => {
  for (let [key, value] of Object.entries(target)) {
    if (typeof value === 'object') {
      if (valueContains(value, keyword)) {
        return true
      }
    }
    else if (typeof value !== 'string') {
      value = String(value)
      if (value.includes(keyword)) {
        return true
      }
    }
    else {
      if (value.includes(keyword)) {
        return true
      }
      if (key === 'date') {
        const date = new Date(value)
        if (date.toLocaleString().includes(keyword)) {
          return true
        }
      }
    }
  }
  return false
}

const hasKeyword = (keyword: string) => (payment: Payment) => {
  return valueContains(payment, keyword)
}

export const RecentPayments = () => {
  const payments = usePaymentsStore(state => state.payments)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState({
    showMemo: false,
    showDate: true
  })

  const filteredPayments = !!search ? payments.filter(hasKeyword(search)) : payments

  function updateStatus(field: string, value: any) {
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

type PaymentItemProps = {
  payment: Payment,
  showMemo: boolean,
  showDate: boolean
}

const PaymentItem = ({ payment, showMemo, showDate }: PaymentItemProps) => {
  const paymentDate = new Date(payment.date)
  return (
    <Grow in timeout={800}>
      <Card className="w-full min-w-[320px]" variant="outlined" sx={{ borderColor: payment.createdByUser ? 'rgba(234, 180, 113, 0.7)' : undefined }}>
        <CardContent>
          <div className="flex justify-between">
            {showDate ? <Typography
              gutterBottom
              sx={{ color: 'text.secondary', fontSize: 14 }}
            >
              {paymentDate.toLocaleString()}
            </Typography> : null}
            {payment.createdByUser ? <Chip label="Created by you!" /> : null}
          </div>
          <Typography variant="body2">
            <span className="text-lg font-bold">{`${payment.sender.name}`}</span> paid
          </Typography>
          <Typography variant="h5" component="div">{`${payment.amount} ${payment.currency}`}</Typography>
          <Typography variant="body2">
            to <span className="text-lg font-bold">{`${payment.receiver.name}`}</span>
          </Typography>
          {(showMemo && !!payment.memo) && <Typography variant="caption" className="text-neutral-500">Memo: {payment.memo}</Typography>}
        </CardContent>
      </Card>
    </Grow>
  )
}