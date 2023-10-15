import { screen } from "@testing-library/react"
import { renderWithNoRoutes } from "../../utils/test-utils"
import QuestionDetailResult from "./QuestionDetailResult"

it("Normal Render", () => {
  renderWithNoRoutes(
    <QuestionDetailResult
      optionOneText="First Option"
      optionTwoText="Second Option"
      optionOneTotalVotes={8}
      optionTwoTotalVotes={12}
      votedOption={"optionOne"}
    />,
  )

  expect(
    screen.getByRole("heading", { level: 4, name: "Poll result" }),
  ).toBeInTheDocument()

  expect(
    screen.getByRole("heading", { name: "First Option" }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole("heading", { name: "Second Option" }),
  ).toBeInTheDocument()
  expect(screen.getByText("8 votes (40.00 %)")).toBeInTheDocument()
  expect(screen.getByText("12 votes (60.00 %)")).toBeInTheDocument()

  // there are 2 bars
  const bars = screen.getAllByRole("progressbar")
  expect(bars[0]).toHaveAttribute("aria-valuenow", "40")
  expect(bars[1]).toHaveAttribute("aria-valuenow", "60")
})
