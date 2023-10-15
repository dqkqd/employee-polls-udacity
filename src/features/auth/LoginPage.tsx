import { Typography } from "@mui/material"
import { Link, useLocation } from "react-router-dom"
import BaseLogin from "../../components/BaseLogin"
import LoginForm from "./LoginForm"

const LoginPage = () => {
  const location = useLocation()

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
      <Typography>
        Don&apos;t have an account?
        <Link
          style={{ margin: 5 }}
          to="/signup"
          state={{ from: location.state?.from }}
        >
          Sign up
        </Link>
        or
        <Link
          style={{ margin: 5 }}
          to="/login/users"
          state={{ from: location.state?.from }}
        >
          Login using a sample account
        </Link>
      </Typography>
    </BaseLogin>
  )
}

export default LoginPage
