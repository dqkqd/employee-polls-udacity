import { act, screen, waitFor } from "@testing-library/react"
import { QuestionNotFoundError } from "../../errors"
import {
  initialAuth,
  initialQuestions,
  initialUsers,
} from "../../utils/test-data"
import { renderDefault, renderWithNoRoutes } from "../../utils/test-utils"
import QuestionCard from "./QuestionCard"

it("Render", async () => {
  const question = Object.values(initialQuestions.entities)[0]
  if (!question) {
    throw new QuestionNotFoundError(question)
  }

  renderWithNoRoutes(<QuestionCard id={question.id} />)

  expect(
    screen.getByRole("heading", {
      name: question.author,
    }),
  ).toBeInTheDocument()

  const createdDate = new Date(question.timestamp).toUTCString()
  expect(screen.getByText(createdDate)).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Show" })).toBeInTheDocument()
})

it("Click button should move to question details", async () => {
  const { user } = renderDefault({
    route: "/home",
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth: initialAuth,
    },
  })

  const buttons = screen.getAllByRole("button", { name: "Show" })

  expect(screen.queryByText(/poll by/i)).not.toBeInTheDocument()
  await act(async () => {
    user.click(buttons[0])
  })
  await waitFor(() => {
    expect(screen.getByText(/poll by/i)).toBeInTheDocument()
  })
})
