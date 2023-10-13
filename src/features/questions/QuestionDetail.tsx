import { Box, Grid, Stack, Typography } from "@mui/material"
import { EntityId } from "@reduxjs/toolkit"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hook"
import { selectUserById } from "../users/usersSlice"
import QuestionDetailOption from "./QuestionDetailOption"
import { selectQuestionById } from "./questionsSlice"

const QuestionDetail = () => {
  const { id } = useParams()

  const question = useAppSelector((state) =>
    selectQuestionById(state, id as EntityId),
  )
  if (!question) {
    throw new Error(`question ${id} does not exist`)
  }

  const author = useAppSelector((state) =>
    selectUserById(state, question.author),
  )
  if (!author) {
    throw new Error(`user ${question.author} does not exist`)
  }

  return (
    <>
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="h5" fontWeight="bolder" m={5}>
          Poll by {author.name}
        </Typography>
        <img
          src={author.avatarURL ?? ""}
          alt="user avatar"
          style={{
            borderRadius: "100%",
            height: 300,
            width: 300,
            margin: "auto",
          }}
        />

        <Typography variant="h4" fontWeight="bold" m={3}>
          Would you rather
        </Typography>

        <Grid container>
          <Grid item xs={6} px={1}>
            <Box display="flex" justifyContent="flex-end">
              <QuestionDetailOption {...question.optionOne} />
            </Box>
          </Grid>
          <Grid item xs={6} px={1}>
            <Box display="flex" justifyContent="flex-start">
              <QuestionDetailOption {...question.optionTwo} />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}

export default QuestionDetail
