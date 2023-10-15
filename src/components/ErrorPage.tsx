import { Box, Typography } from "@mui/material"
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom"
import { useAppSelector } from "../app/hook"
import { selectAuthedUser } from "../features/auth/authSlice"

const ErrorPage = () => {
  const auth = useAppSelector(selectAuthedUser)
  const route = auth.status === "success" ? "/home" : "/login"
  const redirectText =
    auth.status === "success" ? "Go back home" : "Go to login page"

  return (
    <Box
      display="flex"
      flexDirection="column"
      textAlign="center"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h1" mt={10}>
        Oops!
      </Typography>
      <Typography variant="body1" mb={3}>
        Sorry, an unexpected error has occurred.
      </Typography>
      <ErrorBoundary />

      <Typography variant="body1" mt={2}>
        <Link to={route}>{redirectText}</Link>
      </Typography>
    </Box>
  )
}

const ErrorMessage = (props: { message: string }) => {
  return (
    <>
      <Typography variant="h6" color="#888">
        {props.message}
      </Typography>
    </>
  )
}

const ErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return <ErrorMessage message={error.statusText} />
  }

  return <></>
}

export default ErrorPage
