import { screen } from "@testing-library/react"
import { renderWithNoRoutes } from "../utils/test-utils"
import NewQuestion from "./NewQuestion"

it("Render", () => {
  renderWithNoRoutes(<NewQuestion />)
  expect(
    screen.getByRole("heading", { level: 4, name: "Would you rather" }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole("heading", { level: 6, name: "Create your own poll" }),
  ).toBeInTheDocument()
})
