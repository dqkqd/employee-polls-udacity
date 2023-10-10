import { Typography } from "@mui/material"
import BaseAuthPage from "./BaseAuthPage"
import SignupForm from "./SignupForm"

const SignupPage = () => {
  return (
    <BaseAuthPage>
      <Typography variant="h5" mt={2} fontWeight="bolder">
        Sign Up
      </Typography>
      <SignupForm />
    </BaseAuthPage>
  )
}

export default SignupPage
