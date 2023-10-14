import { screen } from "@testing-library/react"
import { QuestionNotFoundError } from "../../errors"
import { initialQuestions } from "../../utils/test-data"
import { renderWithNoRoutes } from "../../utils/test-utils"
import QuestionCard from "./QuestionCard"

describe("Test question card", () => {
  it("render", async () => {
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

  it.todo("click show button should move to question details")
})
