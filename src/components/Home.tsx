import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react"
import { useAppSelector } from "../app/hook"
import { LoginRequiredError, UserNotFoundError } from "../errors"
import { selectAuthedUser } from "../features/auth/authSlice"
import QuestionList from "../features/questions/QuestionList"
import { selectQuestionIds } from "../features/questions/questionsSlice"
import { selectUserById } from "../features/users/usersSlice"

const Home = () => {
  const auth = useAppSelector(selectAuthedUser)

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

  const [tabValue, setTabValue] = useState<"answered" | "unanswered">(
    "unanswered",
  )
  const handleTabValueChange = (
    event: React.SyntheticEvent,
    newTabValue: "answered" | "unanswered",
  ) => {
    setTabValue(newTabValue)
  }

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

        <Tabs
          value={tabValue}
          onChange={handleTabValueChange}
          centered
          sx={{ marginTop: 3 }}
        >
          <Tab label="New Questions" value="unanswered" />
          <Tab label="Answered Questions" value="answered" />
        </Tabs>

        <div
          data-testid="unanswered-questions"
          hidden={tabValue !== "unanswered"}
        >
          <QuestionList title="New questions" ids={unAnsweredQuestionIds} />
        </div>

        <div data-testid="answered-questions" hidden={tabValue !== "answered"}>
          <QuestionList title="Answered questions" ids={answeredQuestionIds} />
        </div>
      </Stack>
    </Box>
  )
}

export default Home
