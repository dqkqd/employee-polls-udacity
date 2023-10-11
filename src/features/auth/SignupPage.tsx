import { Typography } from "@mui/material"
import BaseLogin from "../../components/BaseLogin"
import SignupForm from "./SignupForm"

const SignupPage = () => {
  return (
    <BaseLogin>
      <Typography
        variant="h5"
        mt={2}
        fontWeight="bolder"
        aria-label="sign-up-page-title"
      >
        Sign Up
      </Typography>
      <SignupForm />
    </BaseLogin>
  )
}

export default SignupPage
