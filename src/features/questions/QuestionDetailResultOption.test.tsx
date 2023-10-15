import { screen } from "@testing-library/react"
import { renderWithNoRoutes } from "../../utils/test-utils"
import QuestionDetailResultOption from "./QuestionDetailResultOption"

it("Normal render", () => {
  renderWithNoRoutes(
    <QuestionDetailResultOption
      text="Option text"
      numberOfVotes={3}
      totalVotes={10}
      voted={false}
    />,
  )

  expect(
    screen.getByRole("heading", { name: "Option text" }),
  ).toBeInTheDocument()
  expect(screen.getByText("3 votes (30.00 %)")).toBeInTheDocument()
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "30")
  expect(screen.queryByTestId("voted-icon")).not.toBeInTheDocument()
})

it("Voted options should show tick icon", () => {
  renderWithNoRoutes(
    <QuestionDetailResultOption
      text="Option text"
      numberOfVotes={3}
      totalVotes={10}
      voted={true}
    />,
  )
  expect(screen.getByTestId("voted-icon")).toBeInTheDocument()
})

test.each([0, 1])(
  "%d vote should show %d vote (without s)",
  (numberOfVotes) => {
    renderWithNoRoutes(
      <QuestionDetailResultOption
        text="Option text"
        numberOfVotes={numberOfVotes}
        totalVotes={10}
        voted={true}
      />,
    )

    const percentage = (numberOfVotes * 10).toFixed(2)
    expect(
      screen.getByText(`${numberOfVotes} vote (${percentage} %)`),
    ).toBeInTheDocument()
  },
)
