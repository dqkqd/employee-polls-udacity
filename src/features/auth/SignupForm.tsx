import { Button, FormControl, TextField, Typography } from "@mui/material"
import { useState } from "react"
import PasswordInput from "./PasswordField"

const SignupForm = () => {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const passwordMismatch =
    password && repeatPassword && password !== repeatPassword

  const buttonEnabled = Boolean(
    id && password && repeatPassword && password === repeatPassword,
  )

  const errorMessage = passwordMismatch ? "Password did not match" : ""

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Sign Up")
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
        />
      </FormControl>

      <FormControl>
        <TextField
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          label="Name"
        />
      </FormControl>

      <FormControl>
        <TextField
          value={avatar}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAvatar(e.target.value)
          }
          label="Avatar URL"
        />
      </FormControl>

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
        disabled={!buttonEnabled}
      >
        Sign up
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
