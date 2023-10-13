import { screen } from "@testing-library/react"
import { it } from "vitest"
import {
  initialAuth,
  initialQuestions,
  initialUsers,
} from "../../utils/test-data"
import { renderDefault } from "../../utils/test-utils"

it("Test render", async () => {
  const question = Object.values(initialQuestions.entities)[0]
  if (!question) {
    throw new Error("question must be defined")
  }

  const author = initialUsers.entities[question.author]
  if (!author) {
    throw new Error("author must be defined")
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
  expect(screen.getByText(question.optionOne.text)).toBeInTheDocument()
  expect(screen.getByText(question.optionTwo.text)).toBeInTheDocument()
  expect(screen.getAllByRole("button", { name: /vote/i })).toHaveLength(2)
})
