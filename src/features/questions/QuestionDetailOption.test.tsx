import { render, screen } from "@testing-library/react"
import QuestionDetailOption from "./QuestionDetailOption"

describe("Test question detail option", () => {
  it("render", async () => {
    render(
      <QuestionDetailOption
        text="First option"
        votes={[]}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        select={() => new Promise<void>(() => {})}
      />,
    )
    expect(screen.getByText("First option")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /vote/i })).toBeInTheDocument()
  })
})
