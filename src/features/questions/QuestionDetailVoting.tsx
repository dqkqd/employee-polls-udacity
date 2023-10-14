import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useAppDispatch, useAuth } from "../../app/hook"
import { LoginRequiredError } from "../../errors"
import { AnswerId, QuestionId } from "../../interfaces"
import { pickAnswer } from "../common"
import QuestionDetailVotingOption from "./QuestionDetailVotingOption"

const QuestionDetailVoting = (props: {
  questionId: QuestionId
  optionOneText: string
  optionTwoText: string
}) => {
  const dispatch = useAppDispatch()

  const { id: userId } = useAuth()
  if (!userId) {
    throw new LoginRequiredError()
  }

  const [votingStatus, setVotingStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle")

  const loading = votingStatus === "loading"
  const canVote = votingStatus === "idle" || votingStatus === "failed"

  const selectAnswer = (answerId: AnswerId) => {
    const pick = async () => {
      if (votingStatus === "succeeded") {
        return
      }
      setVotingStatus("loading")
      const response = await dispatch(
        pickAnswer({
          userId,
          questionId: props.questionId,
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

      <Typography variant="h4" fontWeight="bold" m={3}>
        Would you rather
      </Typography>

      <Grid container>
        <Grid item xs={6} px={1}>
          <Box display="flex" justifyContent="flex-end">
            <QuestionDetailVotingOption
              text={props.optionOneText}
              select={selectAnswer("optionOne")}
              canVote={canVote}
            />
          </Box>
        </Grid>
        <Grid item xs={6} px={1}>
          <Box display="flex" justifyContent="flex-start">
            <QuestionDetailVotingOption
              text={props.optionTwoText}
              select={selectAnswer("optionTwo")}
              canVote={canVote}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default QuestionDetailVoting
