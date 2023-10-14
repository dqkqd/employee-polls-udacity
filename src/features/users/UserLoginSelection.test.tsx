import { screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { renderWithNoRoutes } from "../../utils/test-utils"
import UserLoginSelection from "./UserLoginSelection"

it("Render", async () => {
  renderWithNoRoutes(<UserLoginSelection />)
  expect(screen.getByText("Select employee to login")).toBeInTheDocument()
})
