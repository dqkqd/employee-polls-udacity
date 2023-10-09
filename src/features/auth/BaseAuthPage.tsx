import { Box, Stack, Typography } from "@mui/material"

const AuthBasePage = (props: { children: React.ReactNode }) => {
  return (
    <Box justifyContent="center" display="flex" mt={10}>
      <Stack
        sx={{ width: "300px" }}
        spacing={2}
        component="form"
        style={{ textAlign: "center" }}
      >
        <Typography variant="h4" mt={2} fontWeight="bolder">
          Employee Polls
        </Typography>

        <img
          src="login-logo.jpg"
          alt="login logo"
          style={{ borderRadius: "100%" }}
        />

        {props.children}
      </Stack>
    </Box>
  )
}

export default AuthBasePage
