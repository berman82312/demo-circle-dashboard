import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material"
import { type User } from "@/types/models"

type UserSelectorProps = {
  user?: User,
  error?: string,
  label: string,
  users: User[],
  onChange: SelectProps['onChange']
}

export const UserSelector = ({ label, user, users, onChange, error }: UserSelectorProps) => {
  const hasError = !!error
  return (
    <FormControl fullWidth error={hasError}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={user?.id ?? ''}
        onChange={onChange}
      >
        {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
      </Select>
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}