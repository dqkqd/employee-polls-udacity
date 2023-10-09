import { Button, CircularProgress, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAuth } from "../../app/hook"
import PasswordInput from "./PasswordInput"
import { validateUser } from "./authSlice"

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const auth = useAuth()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const handleUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(validateUser({ id, password })).then(() => {
      navigate("/")
    })
  }

  return (
    <>
      <TextField
        id="user-id"
        value={id}
        onChange={handleUserId}
        label="Employee ID"
        data-testid="login-form-input-id"
      />

      <PasswordInput password={password} setPassword={setPassword} />

      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={!id || !password || auth.status === "loading"}
        data-testid="login-form-login-button"
      >
        {auth.status === "loading" ? <CircularProgress /> : "Log In"}
      </Button>

      {auth.status === "failed" && (
        <Typography fontSize={13} color="red">
          Incorrect Employee ID or Password
        </Typography>
      )}
    </>
  )
}

export default LoginForm
