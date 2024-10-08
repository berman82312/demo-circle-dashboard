'use client'
import { usePaymentsStore } from "@/hooks/usePaymentsStore"
import { type Payment } from "@/types/models"
import { Card, CardContent, Chip, Grow, Typography } from "@mui/material"

export const RecentPayments = () => {
  const payments = usePaymentsStore(state => state.payments)

  return (
    <>
      {payments.map(payment => <PaymentItem payment={payment} key={payment.id} />)}
    </>
  )
}

type PaymentItemProps = {
  payment: Payment
}

const PaymentItem = ({ payment }: PaymentItemProps) => {
  const paymentDate = new Date(payment.date)
  return (
    <Grow in timeout={800}>
      <Card className="w-full" variant="outlined" sx={{ borderColor: payment.createdByUser ? 'rgba(234, 180, 113, 0.7)' : undefined }}>
        <CardContent>
          <div className="flex justify-between">
            <Typography
              gutterBottom
              sx={{ color: 'text.secondary', fontSize: 14 }}
            >
              {paymentDate.toLocaleString()}
            </Typography>
            {payment.createdByUser ? <Chip label="Created by you!" /> : null}
          </div>
          <Typography variant="body2">
            <span className="text-lg font-bold">{`${payment.sender.name}`}</span> paid
          </Typography>
          <Typography variant="h5" component="div">{`${payment.amount} ${payment.currency}`}</Typography>
          <Typography variant="body2">
            to <span className="text-lg font-bold">{`${payment.receiver.name}`}</span>
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  )
}