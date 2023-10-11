import { Avatar, Grid, Paper, Typography } from "@mui/material"
import { EntityId } from "@reduxjs/toolkit"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hook"
import { validateUser } from "../auth/authSlice"
import { selectUserById } from "./usersSlice"

const UserLoginCard = (props: { id: EntityId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isHover, setIsHover] = useState(false)

  const user = useAppSelector((state) => selectUserById(state, props.id))
  if (!user) {
    throw new Error("this should go to page 404")
  }

  const handleLogin = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    dispatch(validateUser({ id: user.id, password: user.password })).then(
      () => {
        navigate("/")
      },
    )
  }

  return (
    <Paper
      elevation={isHover ? 20 : 5}
      sx={{
        width: 350,
        height: 65,
        display: "flex",
        alignItems: "center",
        borderRadius: 20,
        padding: 0.5,
        bgcolor: isHover ? "#f38ba8" : "",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={(e) => handleLogin(e)}
    >
      <Grid container display="flex">
        <Grid item xs={4}>
          {user.avatarURL && (
            <Avatar sx={{ width: 60, height: 60 }} src={user.avatarURL} />
          )}
        </Grid>

        <Grid item xs={7} alignItems="center" display="flex">
          <Typography
            variant="h6"
            fontWeight="bold"
            color={isHover ? "white" : "black"}
          >
            {user.name}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default UserLoginCard
