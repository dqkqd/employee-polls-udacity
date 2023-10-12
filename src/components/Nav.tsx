import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import { useAppDispatch, useAuth } from "../app/hook"
import { logoutUser } from "../features/auth/authSlice"

const Nav = () => {
  const dispatch = useAppDispatch()

  const auth = useAuth()
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(logoutUser())
  }

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Tabs value={"home"}>
              <Tab label="HOME" value="home" to="/home" component={Link} />
              <Tab
                label="LEADERBOARD"
                value="leaderboard"
                to="/leaderboard"
                component={Link}
              />
              <Tab
                label="NEW QUESTION"
                value="new"
                to="/new-question"
                component={Link}
              />
            </Tabs>
          </Box>

          <Box
            sx={{
              flexGrow: 0,
              display: { md: "flex" },
              alignItems: "center",
              borderRadius: 50,
              bgcolor: "#dc8a78",
              padding: 1,
              marginY: 1,
              marginX: 5,
            }}
            aria-label="user-nav-icon"
          >
            <Avatar sx={{ width: 40, height: 40 }} src={auth.avatarURL ?? ""} />
            <Typography variant="h5" mx={1} fontWeight="bold">
              {auth.name}
            </Typography>
          </Box>

          <Button
            sx={{
              color: "white",
              display: "block",
              fontSize: 20,
              fontWeight: "bolder",
            }}
            variant="contained"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Nav
