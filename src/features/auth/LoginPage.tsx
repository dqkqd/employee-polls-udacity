import { Typography } from "@mui/material"
import BaseLogin from "../../components/BaseLogin"
import LoginForm from "./LoginForm"

const LoginPage = () => {
  return (
    <BaseLogin>
      <Typography
        variant="h5"
        mt={2}
        fontWeight="bolder"
        aria-label="log-in-page-title"
      >
        Log In
      </Typography>
      <LoginForm />
    </BaseLogin>
  )
}

export default LoginPage
