import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAuth } from "../../app/hook"
import PasswordInput from "./PasswordField"
import { signupUser } from "./authSlice"

const SignupForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const auth = useAuth()

  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const loading = auth.status === "loading"

  const passwordMismatch =
    password && repeatPassword && password !== repeatPassword

  const buttonEnabled = Boolean(
    !loading &&
      id &&
      name &&
      password &&
      repeatPassword &&
      password === repeatPassword,
  )

  let errorMessage = ""
  if (auth.status === "failed") {
    errorMessage = "Please use different employee id"
  } else if (passwordMismatch) {
    errorMessage = "Password did not match"
  }

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(signupUser({ id, name, password, avatarURL: avatar })).then(
      (e) => {
        if (e.meta.requestStatus === "fulfilled") {
          navigate("/")
        }
      },
    )
  }

  return (
    <>
      <FormControl>
        <TextField
          value={id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setId(e.target.value)
          }
          label="Employee ID"
          disabled={loading}
        />
      </FormControl>

      <FormControl>
        <TextField
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          label="Name"
          disabled={loading}
        />
      </FormControl>

      <FormControl>
        <TextField
          value={avatar}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAvatar(e.target.value)
          }
          label="Avatar URL"
          disabled={loading}
        />
      </FormControl>

      <PasswordInput
        password={password}
        setPassword={setPassword}
        disabled={loading}
      />
      <PasswordInput
        password={repeatPassword}
        setPassword={setRepeatPassword}
        label="Re-enter password"
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        onClick={handleSignup}
        disabled={!buttonEnabled}
      >
        {loading ? (
          <CircularProgress data-testid="signup-loading" />
        ) : (
          "Sign up"
        )}
      </Button>

      {errorMessage && (
        <Typography fontSize={13} color="red">
          {errorMessage}
        </Typography>
      )}
    </>
  )
}

export default SignupForm
