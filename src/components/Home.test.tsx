import { act, screen, within } from "@testing-library/react"
import { Question, User } from "../interfaces"
import { initialAuth, initialQuestions, initialUsers } from "../utils/test-data"
import { renderWithNoRoutes } from "../utils/test-utils"
import Home from "./Home"

it("Render", () => {
  const auth = initialAuth
  renderWithNoRoutes(<Home />, {
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth,
    },
  })

  expect(
    screen.getByRole("heading", { level: 4, name: `Hello, ${auth.name}` }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole("tab", { name: /new questions/i }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole("tab", { name: /answered questions/i }),
  ).toBeInTheDocument()
})

it("Unanswered questions are shown by default", () => {
  const auth = initialAuth
  const employee = initialUsers.entities[auth.id as string] as User
  const questions = Object.values(initialQuestions.entities).filter(
    (q): q is Question => q !== undefined,
  )

  const unansweredQuestionAuthors = questions
    .filter((question) => !employee.answers[question.id])
    .map((question) => question.author)

  renderWithNoRoutes(<Home />, {
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth,
    },
  })

  // answered questions should not be shown
  expect(screen.queryByTestId("answered-questions")).not.toBeVisible()

  const unansweredQuestionsTextContents = within(
    screen.getByTestId("unanswered-questions"),
  )
    .getAllByRole("heading", { level: 5 })
    .map((heading) => heading.textContent)
  expect(unansweredQuestionsTextContents[0]).toBe("New questions")
  expect(unansweredQuestionAuthors).toEqual(
    expect.arrayContaining(unansweredQuestionsTextContents.slice(1)),
  )
})

it("show correct questions when changing tab", async () => {
  const auth = initialAuth
  const employee = initialUsers.entities[auth.id as string] as User
  const questions = Object.values(initialQuestions.entities).filter(
    (q): q is Question => q !== undefined,
  )

  const answeredQuestionAuthors = questions
    .filter((question) => employee.answers[question.id])
    .map((question) => question.author)

  const unansweredQuestionAuthors = questions
    .filter((question) => !employee.answers[question.id])
    .map((question) => question.author)

  const { user } = renderWithNoRoutes(<Home />, {
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth,
    },
  })

  await act(async () => {
    await user.click(screen.getByRole("tab", { name: /answered questions/i }))
  })

  expect(screen.queryByTestId("answered-questions")).toBeVisible()
  expect(screen.queryByTestId("unanswered-questions")).not.toBeVisible()

  const answeredQuestionsTextContents = within(
    screen.getByTestId("answered-questions"),
  )
    .getAllByRole("heading", { level: 5 })
    .map((heading) => heading.textContent)
  expect(answeredQuestionsTextContents[0]).toBe("Answered questions")
  expect(answeredQuestionAuthors).toEqual(
    expect.arrayContaining(answeredQuestionsTextContents.slice(1)),
  )

  await act(async () => {
    await user.click(screen.getByRole("tab", { name: /new questions/i }))
  })

  expect(screen.queryByTestId("answered-questions")).not.toBeVisible()
  expect(screen.queryByTestId("unanswered-questions")).toBeVisible()

  const unansweredQuestionsTextContents = within(
    screen.getByTestId("unanswered-questions"),
  )
    .getAllByRole("heading", { level: 5 })
    .map((heading) => heading.textContent)
  expect(unansweredQuestionsTextContents[0]).toBe("New questions")
  expect(unansweredQuestionAuthors).toEqual(
    expect.arrayContaining(unansweredQuestionsTextContents.slice(1)),
  )
})
