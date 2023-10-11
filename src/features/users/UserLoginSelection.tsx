import { Typography } from "@mui/material"
import BaseLogin from "../../components/BaseLogin"
import UserLoginList from "./UserLoginList"

const UserLoginSelection = () => {
  return (
    <BaseLogin>
      <Typography variant="h5" mt={2} fontWeight="bolder">
        Select employee to login
      </Typography>
      <UserLoginList />
    </BaseLogin>
  )
}

export default UserLoginSelection
