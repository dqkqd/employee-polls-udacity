import { act, screen, waitFor } from "@testing-library/react"
import { it } from "vitest"
import { getQuestions, getUsers } from "../../api"
import { QuestionNotFoundError } from "../../errors"
import { AnswerId, UserId } from "../../interfaces"
import {
  addedQuestions,
  addedUsers,
  initialAuth,
  initialQuestions,
  initialUsers,
} from "../../utils/test-data"
import { renderWithNoRoutes } from "../../utils/test-utils"
import QuestionDetailVoting from "./QuestionDetailVoting"

it("Test render", async () => {
  const question = Object.values(initialQuestions.entities)[0]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }

  const auth = initialAuth

  renderWithNoRoutes(
    <QuestionDetailVoting
      questionId={question.id}
      userId={auth.id as string}
      optionOneText={question.optionOne.text}
      optionTwoText={question.optionTwo.text}
    />,
    {
      preloadedState: {
        users: initialUsers,
        questions: initialQuestions,
        auth: initialAuth,
      },
    },
  )

  expect(screen.getByText(question.optionOne.text)).toBeInTheDocument()
  expect(screen.getByText(question.optionTwo.text)).toBeInTheDocument()
  expect(screen.getAllByRole("button", { name: /vote/i })).toHaveLength(2)
})

test.each([
  {
    answerId: "optionOne",
    isAuthor: false,
    description: "Normal user can vote question",
  },
  {
    answerId: "optionOne",
    isAuthor: true,
    description: "Author can vote their own question",
  },
])("$description", async ({ answerId, isAuthor }) => {
  const question = isAuthor ? addedQuestions[0] : addedQuestions[1]

  const auth = initialAuth

  if (isAuthor && question.author !== auth.id) {
    throw new Error("make sure author is voting their own question")
  }

  if (!isAuthor && question.author === auth.id) {
    throw new Error("make sure user is voting other's question")
  }

  const { store, user } = renderWithNoRoutes(
    <QuestionDetailVoting
      questionId={question.id}
      userId={auth.id as string}
      optionOneText={question.optionOne.text}
      optionTwoText={question.optionTwo.text}
    />,
    {
      preloadedState: {
        users: initialUsers,
        questions: initialQuestions,
        auth: initialAuth,
      },
    },
  )

  const buttons = screen.getAllByRole("button", { name: /vote/i })
  const button = answerId === "optionOne" ? buttons[0] : buttons[1]

  await act(async () => {
    await user.click(button)
  })

  await waitFor(() => {
    expect(
      screen.queryByText(`User id '${auth.id} already answer this question`),
    ).not.toBeInTheDocument()
  })

  // make sure everything is added into database
  await act(async () => {
    await expect(
      getUsers().then((users) => users[auth.id as UserId].answers[question.id]),
    ).resolves.toBe(answerId)

    await expect(
      getQuestions().then(
        (questions) => questions[question.id].optionOne.votes,
      ),
      // eslint-disable-next-line jest/valid-expect
    ).resolves.to.includes(auth.id)
  })

  // make sure everything is added into store
  expect(
    store.getState().questions.entities[question.id]?.[answerId as AnswerId]
      .votes,
    // eslint-disable-next-line jest/valid-expect
  ).to.includes(auth.id)

  expect(
    store.getState().users.entities[auth.id as UserId]?.answers[question.id],
  ).toBe(answerId)
})

it("Loading when voting new answer", async () => {
  const question = Object.values(initialQuestions.entities)[1]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }
  const auth = initialAuth

  const { user } = renderWithNoRoutes(
    <QuestionDetailVoting
      questionId={question.id}
      userId={auth.id as string}
      optionOneText={question.optionOne.text}
      optionTwoText={question.optionTwo.text}
    />,
    {
      preloadedState: {
        users: initialUsers,
        questions: initialQuestions,
        auth: initialAuth,
      },
    },
  )

  const buttons = screen.getAllByRole("button", { name: /vote/i })

  expect(screen.queryByTestId("answer-loading")).not.toBeVisible()
  expect(buttons[0]).toBeEnabled()
  expect(buttons[1]).toBeEnabled()

  await act(async () => {
    await user.click(buttons[0])
  })
  expect(screen.getByTestId("answer-loading")).toBeVisible()

  expect(buttons[0]).toBeDisabled()
  expect(buttons[1]).toBeDisabled()
})

it("User can not vote the same question 2 times", async () => {
  const question = addedQuestions[2]
  const auth = initialAuth
  const employee = addedUsers[0]

  if (employee.id !== auth.id) {
    throw new Error("make sure we are talking about the same employee")
  }

  if (
    !question.optionOne.votes.includes(auth.id as string) &&
    !question.optionTwo.votes.includes(auth.id as string) &&
    !employee.answers[question.id]
  ) {
    throw new Error("user must voted this question before")
  }

  const { user } = renderWithNoRoutes(
    <QuestionDetailVoting
      questionId={question.id}
      userId={auth.id as string}
      optionOneText={question.optionOne.text}
      optionTwoText={question.optionTwo.text}
    />,
    {
      preloadedState: {
        users: initialUsers,
        questions: initialQuestions,
        auth: initialAuth,
      },
    },
  )

  const buttons = screen.getAllByRole("button", { name: /vote/i })

  await act(async () => {
    await user.click(buttons[0])
  })

  await waitFor(() => {
    expect(
      screen.getByText(`User id '${employee.id} already answer this question`),
    ).toBeInTheDocument()
  })
})
