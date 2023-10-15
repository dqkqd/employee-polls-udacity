import { Stack, Typography } from "@mui/material"
import { EntityId } from "@reduxjs/toolkit"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hook"
import {
  LoginRequiredError,
  QuestionNotFoundError,
  UserNotFoundError,
} from "../../errors"
import { AnswerId } from "../../interfaces"
import { selectAuthedUser } from "../auth/authSlice"
import { selectUserById } from "../users/usersSlice"
import QuestionDetailResult from "./QuestionDetailResult"
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

  const { id: userId } = useAppSelector(selectAuthedUser)
  if (!userId) {
    throw new LoginRequiredError()
  }

  let votedOption: AnswerId | null = null
  if (question.optionOne.votes.includes(userId)) {
    votedOption = "optionOne"
  } else if (question.optionTwo.votes.includes(userId)) {
    votedOption = "optionTwo"
  }

  return (
    <>
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="h5" fontWeight="bolder" m={5}>
          Poll by {author.id === userId ? "You" : author.name}
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

        {votedOption === null ? (
          <QuestionDetailVoting
            questionId={question.id}
            userId={userId}
            optionOneText={question.optionOne.text}
            optionTwoText={question.optionTwo.text}
          />
        ) : (
          <QuestionDetailResult
            optionOneText={question.optionOne.text}
            optionTwoText={question.optionTwo.text}
            optionOneTotalVotes={question.optionOne.votes.length}
            optionTwoTotalVotes={question.optionTwo.votes.length}
            votedOption={votedOption}
          />
        )}
      </Stack>
    </>
  )
}

export default QuestionDetail
