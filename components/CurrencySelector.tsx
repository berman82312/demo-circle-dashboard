import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material"
import { Currency } from "@/types/models"

type CurrencySelectorProps = {
  value: Currency | "",
  onChange: SelectProps['onChange'],
  error?: string
}

export const CurrencySelector = ({ value, onChange, error }: CurrencySelectorProps) => {
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
