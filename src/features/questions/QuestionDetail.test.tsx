import { screen, within } from "@testing-library/react"
import { it } from "vitest"
import { QuestionNotFoundError, UserNotFoundError } from "../../errors"
import {
  addedQuestions,
  initialAuth,
  initialQuestions,
  initialUsers,
} from "../../utils/test-data"
import { renderDefault } from "../../utils/test-utils"

it("Test render", async () => {
  const question = Object.values(initialQuestions.entities)[0]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }

  const author = initialUsers.entities[question.author]
  if (!author) {
    throw new UserNotFoundError(question.author)
  }

  renderDefault({
    route: `/questions/${question.id}`,
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth: initialAuth,
    },
  })

  expect(screen.getByText(`Poll by ${author.name}`)).toBeInTheDocument()
  expect(screen.getByText("Would you rather")).toBeInTheDocument()
})

it("User did not vote should not be able to see poll result", async () => {
  const question = Object.values(initialQuestions.entities)[0]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }

  const auth = initialAuth
  if (
    question.optionOne.votes.includes(auth.id as string) ||
    question.optionTwo.votes.includes(auth.id as string)
  ) {
    throw new Error("make sure user did not vote")
  }

  renderDefault({
    route: `/questions/${question.id}`,
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth,
    },
  })

  expect(
    screen.getByRole("heading", { level: 4, name: "Would you rather" }),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("heading", { level: 4, name: "Poll result" }),
  ).not.toBeInTheDocument()
})

it("Voted user should see poll result", async () => {
  const question = addedQuestions[2]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }

  const auth = initialAuth
  if (!question.optionOne.votes.includes(auth.id as string)) {
    throw new Error("make sure user voted")
  }

  renderDefault({
    route: `/questions/${question.id}`,
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth,
    },
  })

  expect(
    screen.queryByRole("heading", { level: 4, name: "Would you rather" }),
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole("heading", { level: 4, name: "Poll result" }),
  ).toBeInTheDocument()

  const resultOptionEle = screen.getAllByTestId("detail-result-option")
  expect(resultOptionEle).toHaveLength(2)
  expect(
    within(resultOptionEle[0]).getByTestId("voted-icon"),
  ).toBeInTheDocument()
  expect(
    within(resultOptionEle[1]).queryByTestId("voted-icon"),
  ).not.toBeInTheDocument()
})

it("Poll author should see Poll by you instead", async () => {
  const question = addedQuestions[0]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }

  const auth = initialAuth

  if (question.author !== auth.id) {
    throw new Error("make sure auth user is the author")
  }

  renderDefault({
    route: `/questions/${question.id}`,
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth,
    },
  })

  expect(screen.getByText(/poll by you/i)).toBeInTheDocument()
})
