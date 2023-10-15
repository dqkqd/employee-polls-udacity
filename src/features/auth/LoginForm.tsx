import { Button, CircularProgress, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hook"
import PasswordInput from "./PasswordField"
import { selectAuthedUser, validateUser } from "./authSlice"

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const auth = useAppSelector(selectAuthedUser)
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  const loading = auth.status === "loading"

  const buttonEnabled = Boolean(!loading && id && password)

  const errorMessage =
    auth.status === "failed" ? "Incorrect Employee ID or Password" : ""

  const handleUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await dispatch(validateUser({ id, password }))
    if (response.meta.requestStatus === "fulfilled") {
      const from = location.state?.from?.pathname || "/home"
      navigate(from, { state: { from: location } })
    }
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
