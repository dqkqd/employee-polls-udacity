import { Box, Stack, Typography } from "@mui/material"
import logo from "../login-logo.jpg"

const AuthBasePage = (props: { children: React.ReactNode }) => {
  return (
    <Box justifyContent="center" display="flex" mt={2}>
      <Stack
        sx={{ width: "500px" }}
        spacing={3}
        component="form"
        style={{ textAlign: "center" }}
      >
        <Typography variant="h4" mt={2} fontWeight="bolder">
          Employee Polls
        </Typography>

        <img
          src={logo}
          alt="login logo"
          style={{
            borderRadius: "100%",
            height: 300,
            width: 300,
            margin: "auto",
          }}
        />

        {props.children}
      </Stack>
    </Box>
  )
}

export default AuthBasePage
