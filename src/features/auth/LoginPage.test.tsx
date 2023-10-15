import { screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { renderWithNoRoutes } from "../../utils/test-utils"
import LoginPage from "./LoginPage"

it("Render", () => {
  const { baseElement } = renderWithNoRoutes(<LoginPage />)
  expect(baseElement).toMatchSnapshot()

  expect(screen.getByLabelText("log-in-page-title")).toHaveTextContent("Log In")
  expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
  expect(screen.getByLabelText("Password")).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
})
