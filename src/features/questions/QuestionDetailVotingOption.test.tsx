import { render, screen } from "@testing-library/react"
import QuestionDetailVotingOption from "./QuestionDetailVotingOption"

it("Render", async () => {
  render(
    <QuestionDetailVotingOption
      text="First option"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      select={() => new Promise<void>(() => {})}
    />,
  )
  expect(screen.getByText("First option")).toBeInTheDocument()
  expect(screen.getByRole("button", { name: /vote/i })).toBeInTheDocument()
})

it("Button enabled", async () => {
  render(
    <QuestionDetailVotingOption
      text="First option"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      select={() => new Promise<void>(() => {})}
      canVote={true}
    />,
  )
  expect(screen.getByRole("button", { name: /vote/i })).toBeEnabled()
})

it("Button disabled", async () => {
  render(
    <QuestionDetailVotingOption
      text="First option"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      select={() => new Promise<void>(() => {})}
      canVote={false}
    />,
  )
  expect(screen.getByRole("button", { name: /vote/i })).toBeDisabled()
})
