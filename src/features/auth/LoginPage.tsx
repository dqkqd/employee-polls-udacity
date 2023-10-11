import { Typography } from "@mui/material"
import BaseAuthPage from "./BaseAuthPage"
import LoginForm from "./LoginForm"

const LoginPage = () => {
  return (
    <BaseAuthPage>
      <Typography
        variant="h5"
        mt={2}
        fontWeight="bolder"
        aria-label="log-in-page-title"
      >
        Log In
      </Typography>
      <LoginForm />
    </BaseAuthPage>
  )
}

export default LoginPage
