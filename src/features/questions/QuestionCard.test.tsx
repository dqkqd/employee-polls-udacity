import { screen } from "@testing-library/react"
import { initialQuestions } from "../../utils/test-data"
import { renderWithNoRoutes } from "../../utils/test-utils"
import QuestionCard from "./QuestionCard"

describe("Test question card", () => {
  it("render", async () => {
    const question = Object.values(initialQuestions.entities)[0]
    if (!question) {
      throw new Error("question must be defined")
    }

    renderWithNoRoutes(<QuestionCard id={question.id} />)

    expect(
      screen.getByRole("heading", {
        name: question.author,
      }),
    ).toBeInTheDocument()

    const now = new Date(Date.now()).toUTCString()
    const reg = new RegExp(now.slice(0, 16))
    expect(screen.getByText(reg)).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "Show" })).toBeInTheDocument()
  })

  it.todo("click show button should move to question details")
})
