import {
  Avatar,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useAppSelector } from "../app/hook"
import { selectUsersSortedByScore } from "../features/users/usersSlice"

const TableCellHeader = (props: {
  text: string
  align?: "left" | "right" | "center"
  dark?: boolean
}) => {
  return (
    <TableCell
      align={props.align ?? "left"}
      sx={{ bgcolor: props.dark ? "#eee" : "#fff" }}
    >
      <Typography fontWeight={600}>{props.text}</Typography>
    </TableCell>
  )
}

const Leaderboard = () => {
  const users = useAppSelector(selectUsersSortedByScore)

  const leaderBoardBody = users.map((user, index) => {
    return (
      <TableRow key={user.id}>
        <TableCell padding="normal" align="center">
          {index + 1}
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 40, height: 40 }} src={user.avatarURL ?? ""} />
            <Typography variant="body1" ml={2} fontWeight="bold">
              {user.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{Object.keys(user.answers).length}</TableCell>
        <TableCell>{user.questions.length}</TableCell>
      </TableRow>
    )
  })

  return (
    <Stack display="flex" justifyContent="center" alignItems="center">
      <Typography variant="h4" textAlign="center" my={5}>
        Leader Board
      </Typography>

      <Box width={800}>
        <TableContainer component={Paper} elevation={10}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellHeader text="Rank" align="center" dark />
                <TableCellHeader text="User" dark />
                <TableCellHeader text="Answer" dark />
                <TableCellHeader text="Created" dark />
              </TableRow>
            </TableHead>

            <TableBody>{leaderBoardBody}</TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  )
}

export default Leaderboard
