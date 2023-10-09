import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react"

const PasswordInput = (props: {
  password: string
  setPassword: Dispatch<SetStateAction<string>>
  label?: string
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
    <TextField
      type={showPassword ? "text" : "password"}
      value={props.password}
      onChange={handlePasswordChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownShowPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      label={props.label || "Password"}
    />
  )
}

export default PasswordInput
