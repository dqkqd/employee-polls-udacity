import { render, screen } from "@testing-library/react"
import QuestionDetailOption from "./QuestionDetailOption"

describe("Test question detail option", () => {
  it("render", async () => {
    render(<QuestionDetailOption text="First option" votes={[]} />)
    expect(screen.getByText("First option")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /vote/i })).toBeInTheDocument()
  })
})
