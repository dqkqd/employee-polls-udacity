import { screen } from "@testing-library/react"
import { it } from "vitest"
import { renderDefault } from "../utils/test-utils"

it("User will be redirected to /login if unauthorized", () => {
  renderDefault({ route: "/" })
  expect(screen.getByLabelText("log-in-page-title")).toHaveTextContent("Log In")
})
