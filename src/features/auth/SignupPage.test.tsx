import { screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { renderDefault } from "../../utils/test-utils"

it("Render", () => {
  renderDefault({ route: "/signup" })

  expect(screen.getByLabelText("sign-up-page-title")).toHaveTextContent(
    "Sign Up",
  )
  expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
  expect(screen.getByLabelText("Name")).toBeInTheDocument()
  expect(screen.getByLabelText("Avatar URL")).toBeInTheDocument()
  expect(screen.getByLabelText("Password")).toBeInTheDocument()
  expect(screen.getByLabelText("Re-enter password")).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument()
})
