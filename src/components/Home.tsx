import { Box, Divider, Stack, Typography } from "@mui/material"
import { useAppSelector, useAuth } from "../app/hook"
import { LoginRequiredError, UserNotFoundError } from "../errors"
import QuestionList from "../features/questions/QuestionList"
import { selectQuestionIds } from "../features/questions/questionsSlice"
import { selectUserById } from "../features/users/usersSlice"

const Home = () => {
  const auth = useAuth()
  if (!auth.id) {
    throw new LoginRequiredError()
  }

  const user = useAppSelector((state) =>
    selectUserById(state, auth.id as string),
  )
  if (!user) {
    throw new UserNotFoundError()
  }

  const questionIds = useAppSelector(selectQuestionIds)

  // don't take user.answers.keys as id directly, since they might not be sorted by created time
  const answeredQuestionIds = questionIds
    .filter((qid) => user.answers[qid])
    .map(String)
  const unAnsweredQuestionIds = questionIds
    .filter((qid) => !user.answers[qid])
    .map(String)

  return (
    <Box display="flex" justifyContent="center">
      <Stack sx={{ width: "100%" }}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bolder"
          mt={5}
          mb={2}
        >
          Hello, {auth.name}
        </Typography>

        <Divider />

        <div data-testid="unanswered-questions">
          <QuestionList title="New questions" ids={unAnsweredQuestionIds} />
        </div>

        <div data-testid="answered-questions">
          <QuestionList title="Answered questions" ids={answeredQuestionIds} />
        </div>
      </Stack>
    </Box>
  )
}

export default Home
