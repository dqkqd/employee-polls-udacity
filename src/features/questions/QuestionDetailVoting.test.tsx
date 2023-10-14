import { act, screen } from "@testing-library/react"
import { it } from "vitest"
import { getQuestions, getUsers } from "../../api"
import { QuestionNotFoundError, UserNotFoundError } from "../../errors"
import { AnswerId, UserId } from "../../interfaces"
import {
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

  const author = initialUsers.entities[question.author]
  if (!author) {
    throw new UserNotFoundError(question.author)
  }

  renderWithNoRoutes(
    <QuestionDetailVoting
      questionId={question.id}
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
    questionIndex: 1,
    isAuthor: false,
    description: "Normal user can vote question with optionOne",
  },
  {
    answerId: "optionTwo",
    questionIndex: 1,
    isAuthor: false,
    description: "Normal user can vote question with optionTwo",
  },
  {
    answerId: "optionOne",
    questionIndex: 0,
    isAuthor: true,
    description: "Author can vote their own question with optionOne",
  },
  {
    answerId: "optionTwo",
    questionIndex: 0,
    isAuthor: true,
    description: "Author can vote their own question with optionTwo",
  },
])("$description", async ({ answerId, questionIndex, isAuthor }) => {
  const question = Object.values(initialQuestions.entities)[questionIndex]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }

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

  const { user } = renderWithNoRoutes(
    <QuestionDetailVoting
      questionId={question.id}
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
