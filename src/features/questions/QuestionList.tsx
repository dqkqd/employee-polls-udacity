import { Box, Pagination, Paper, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { PAGINATION_PER_PAGE } from "../../env"
import { QuestionId } from "../../interfaces"
import QuestionCard from "./QuestionCard"

const QuestionList = (props: { title: string; ids: QuestionId[] }) => {
  const [page, setPage] = useState(1)
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPage(page)
  }

  const totalPages = Math.ceil(props.ids.length / PAGINATION_PER_PAGE)
  const selectedIds = props.ids.slice(
    PAGINATION_PER_PAGE * (page - 1),
    PAGINATION_PER_PAGE * page,
  )

  const questionCards = selectedIds.map((id) => (
    <QuestionCard key={id} id={id} />
  ))

  return (
    <Box display="flex" alignItems="center" justifyContent="center" my={5}>
      <Paper elevation={5} sx={{ width: "80%" }}>
        <Stack display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h5" textAlign="center" fontWeight="bold" my={2}>
            {props.title}
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            maxHeight={600}
          >
            {questionCards}
          </Box>

          <Pagination
            count={totalPages}
            onChange={handleChangePage}
            size="large"
            sx={{ marginY: 2 }}
          />
        </Stack>
      </Paper>
    </Box>
  )
}

export default QuestionList
