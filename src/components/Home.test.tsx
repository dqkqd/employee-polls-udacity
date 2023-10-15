import { screen, within } from "@testing-library/react"
import { Question, User } from "../interfaces"
import { initialAuth, initialQuestions, initialUsers } from "../utils/test-data"
import { renderWithNoRoutes } from "../utils/test-utils"
import Home from "./Home"

it("Render", () => {
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

  const answeredQuestionsTextContents = within(
    screen.getByTestId("answered-questions"),
  )
    .getAllByRole("heading", { level: 5 })
    .map((heading) => heading.textContent)
  expect(answeredQuestionsTextContents[0]).toBe("Answered questions")
  expect(answeredQuestionAuthors.slice().sort()).toStrictEqual(
    answeredQuestionsTextContents.slice(1).sort(),
  )

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
