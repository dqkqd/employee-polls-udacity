import { Box, Stack } from "@mui/material"
import { useAppSelector } from "../../app/hook"
import UserLoginCard from "./UserLoginCard"
import { selectUserIds } from "./usersSlice"

const UserLoginList = () => {
  const userIds = useAppSelector(selectUserIds)
  const userLists = userIds.map((id) => <UserLoginCard key={id} id={id} />)
  return (
    <Box display="flex" justifyContent="center">
      <Stack spacing={2}>{userLists}</Stack>
    </Box>
  )
}

export default UserLoginList
