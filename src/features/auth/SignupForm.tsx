import {
  Button,
  CircularProgress,
  Input,
  InputLabel,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useAuth } from "../../app/hook"
import PasswordInput from "./PasswordField"

const SignupForm = () => {
  const auth = useAuth()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const handleUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Sign Up")
  }

  return (
    <>
      <InputLabel htmlFor="user-id">Employee ID</InputLabel>
      <Input
        id="user-id"
        value={id}
        onChange={handleUserId}
        data-testid="login-form-input-id"
      />

      <PasswordInput
        password={password}
        setPassword={setPassword}
        data-testid="password"
      />
      <PasswordInput
        password={repeatPassword}
        setPassword={setRepeatPassword}
        label="Re-enter password"
        data-testid="repeat-password"
      />

      <Button
        variant="contained"
        onClick={handleSignup}
        data-testid="login-form-login-button"
      >
        {auth.status === "loading" ? <CircularProgress /> : "Sign up"}
      </Button>

      {auth.status === "failed" && (
        <Typography fontSize={13} color="red">
          error msg
        </Typography>
      )}
    </>
  )
}

export default SignupForm
