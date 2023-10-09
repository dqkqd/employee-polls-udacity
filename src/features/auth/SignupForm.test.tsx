import { act, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "../../utils/test-utils"
import SignupForm from "./SignupForm"

describe("Test signup form", () => {
  it("Render", () => {
    renderWithProviders(<SignupForm />, { route: "/signup" })

    expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Re-enter password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument()
  })

  describe("Input", () => {
    it.only("Write to form should change text", async () => {
      const { user } = renderWithProviders(<SignupForm />, { route: "/signup" })

      const idEle = screen.getByLabelText("Employee ID")
      expect(idEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(idEle, "@new-user-id")
      })
      expect(idEle).toHaveDisplayValue("@new-user-id")

      const passwordEle = screen.getByLabelText("Password", {
        selector: "input",
      })
      expect(passwordEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(passwordEle, "@new-password")
      })
      expect(passwordEle).toHaveDisplayValue("@new-password")

      const repeatPasswordEle = screen.getByLabelText("Re-enter password", {
        selector: "input",
      })
      await act(async () => {
        await user.type(repeatPasswordEle, "@new-password")
      })
      expect(repeatPasswordEle).toHaveDisplayValue("@new-password")
    })
  })
})
