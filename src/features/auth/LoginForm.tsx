import { Button, CircularProgress, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAuth } from "../../app/hook"
import PasswordInput from "./PasswordField"
import { validateUser } from "./authSlice"

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const auth = useAuth()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const loading = auth.status === "loading"

  const buttonEnabled = Boolean(!loading && id && password)

  const errorMessage =
    auth.status === "failed" ? "Incorrect Employee ID or Password" : ""

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
        value={id}
        onChange={handleUserId}
        label="Employee ID"
        disabled={loading}
      />

      <PasswordInput
        password={password}
        setPassword={setPassword}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        onClick={handleLogin}
        disabled={!buttonEnabled}
      >
        {loading ? <CircularProgress data-testid="login-loading" /> : "Log In"}
      </Button>

      {errorMessage && (
        <Typography fontSize={13} color="red">
          {errorMessage}
        </Typography>
      )}
    </>
  )
}

export default LoginForm
