import { Visibility, VisibilityOff } from "@mui/icons-material"
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react"

const PasswordInput = (props: {
  password: string
  setPassword: Dispatch<SetStateAction<string>>
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setPassword(e.target.value)
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownShowPassword = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
  }

  return (
    <FormControl>
      <InputLabel htmlFor="password">Password</InputLabel>
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        value={props.password}
        onChange={handlePasswordChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownShowPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        data-testid="login-form-input-password"
      />
    </FormControl>
  )
}

export default PasswordInput
