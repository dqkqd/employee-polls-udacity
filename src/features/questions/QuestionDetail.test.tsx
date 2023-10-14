import { screen } from "@testing-library/react"
import { it } from "vitest"
import { QuestionNotFoundError, UserNotFoundError } from "../../errors"
import {
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
