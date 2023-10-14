import { Stack, Typography } from "@mui/material"
import { EntityId } from "@reduxjs/toolkit"
import { useParams } from "react-router-dom"
import { useAppSelector, useAuth } from "../../app/hook"
import {
  LoginRequiredError,
  QuestionNotFoundError,
  UserNotFoundError,
} from "../../errors"
import { selectUserById } from "../users/usersSlice"
import QuestionDetailVoting from "./QuestionDetailVoting"
import { selectQuestionById } from "./questionsSlice"

const QuestionDetail = () => {
  const { id } = useParams()

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

        <QuestionDetailVoting
          questionId={question.id}
          optionOneText={question.optionOne.text}
          optionTwoText={question.optionTwo.text}
        />
      </Stack>
    </>
  )
}

export default QuestionDetail
