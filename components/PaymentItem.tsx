import { Card, CardContent, Chip, Grow, Typography } from "@mui/material"
import { type Payment } from "@/types/models"

type PaymentItemProps = {
  payment: Payment,
  showMemo: boolean,
  showDate: boolean
}

export const PaymentItem = ({ payment, showMemo, showDate }: PaymentItemProps) => {
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