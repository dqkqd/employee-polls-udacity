import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material"
import { EntityId } from "@reduxjs/toolkit"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector, useAuth } from "../../app/hook"
import {
  LoginRequiredError,
  QuestionNotFoundError,
  UserNotFoundError,
} from "../../errors"
import { AnswerId } from "../../interfaces"
import { pickAnswer } from "../common"
import { selectUserById } from "../users/usersSlice"
import QuestionDetailOption from "./QuestionDetailOption"
import { selectQuestionById } from "./questionsSlice"

const QuestionDetail = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const question = useAppSelector((state) =>
    selectQuestionById(state, id as EntityId),
  )
  if (!question) {
    throw new QuestionNotFoundError(id)
  }

  const author = useAppSelector((state) =>
    selectUserById(state, question.author),
  )
  if (!author) {
    throw new UserNotFoundError(question.author)
  }

  const { id: userId } = useAuth()
  if (!userId) {
    throw new LoginRequiredError()
  }

  let votedAnswer: AnswerId | null = null
  if (question.optionOne.votes.includes(userId)) {
    votedAnswer = "optionOne"
  } else if (question.optionTwo.votes.includes(userId)) {
    votedAnswer = "optionTwo"
  }

  const [votingStatus, setVotingStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >(votedAnswer !== null ? "succeeded" : "idle")

  const loading = votingStatus === "loading"
  const canVote =
    (votingStatus === "idle" || votingStatus === "failed") &&
    votedAnswer === null

  const selectAnswer = (answerId: AnswerId) => {
    const pick = async () => {
      if (votingStatus === "succeeded") {
        return
      }
      setVotingStatus("loading")
      const response = await dispatch(
        pickAnswer({
          userId,
          questionId: question.id,
          answerId,
        }),
      ).unwrap()
      setVotingStatus(response ? "succeeded" : "failed")
    }
    return pick
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" data-testid="answer-loading" />
      </Backdrop>

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
              <QuestionDetailOption
                {...question.optionOne}
                select={selectAnswer("optionOne")}
                canVote={canVote}
              />
            </Box>
          </Grid>
          <Grid item xs={6} px={1}>
            <Box display="flex" justifyContent="flex-start">
              <QuestionDetailOption
                {...question.optionTwo}
                select={selectAnswer("optionTwo")}
                canVote={canVote}
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </>
  )
}

export default QuestionDetail
