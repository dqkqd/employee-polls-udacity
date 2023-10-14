import { render, screen } from "@testing-library/react"
import QuestionDetailOption from "./QuestionDetailOption"

it("Render", async () => {
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

it("Button enabled", async () => {
  render(
    <QuestionDetailOption
      text="First option"
      votes={[]}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      select={() => new Promise<void>(() => {})}
      canVote={true}
    />,
  )
  expect(screen.getByRole("button", { name: /vote/i })).toBeEnabled()
})

it("Button disabled", async () => {
  render(
    <QuestionDetailOption
      text="First option"
      votes={[]}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      select={() => new Promise<void>(() => {})}
      canVote={false}
    />,
  )
  expect(screen.getByRole("button", { name: /vote/i })).toBeDisabled()
})
