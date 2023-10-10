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
    it("Write to form should change text", async () => {
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

    it("Show error when password mismatch", async () => {
      const { user } = renderWithProviders(<SignupForm />, { route: "/signup" })

      const passwordEle = screen.getByLabelText("Password", {
        selector: "input",
      })
      const repeatPasswordEle = screen.getByLabelText("Re-enter password", {
        selector: "input",
      })

      await act(async () => {
        await user.type(passwordEle, "@new-password")
        await user.type(repeatPasswordEle, "@new-password2")
      })
      expect(screen.getByText("Password did not match")).toBeInTheDocument()

      await act(async () => {
        await user.clear(repeatPasswordEle)
        await user.type(repeatPasswordEle, "@new-password")
      })
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()
    })

    it("Do not show error when password field is empty", async () => {
      const { user } = renderWithProviders(<SignupForm />, { route: "/signup" })

      const passwordEle = screen.getByLabelText("Password", {
        selector: "input",
      })
      const repeatPasswordEle = screen.getByLabelText("Re-enter password", {
        selector: "input",
      })

      // password and repeatPassword is empty
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()

      // password is not empty, repeatPassword is empty
      await act(async () => {
        await user.type(passwordEle, "@new-password")
      })
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()

      // password is empty, repeatPassword is not empty
      await act(async () => {
        await user.clear(passwordEle)
        await user.type(repeatPasswordEle, "@new-password")
      })
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()
    })
  })

  describe("Button", () => {
    it("Should be disabled when one of the input is empty", async () => {
      const { user } = renderWithProviders(<SignupForm />, { route: "/signup" })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      const inputEle = screen.getByLabelText("Employee ID")
      const passwordEle = screen.getByLabelText("Password")
      const repeatPasswordEle = screen.getByLabelText("Re-enter password")

      await act(async () => {
        await user.type(inputEle, "123")
        await user.clear(passwordEle)
        await user.clear(repeatPasswordEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      await act(async () => {
        await user.clear(inputEle)
        await user.type(passwordEle, "123")
        await user.clear(repeatPasswordEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      await act(async () => {
        await user.clear(inputEle)
        await user.clear(passwordEle)
        await user.type(repeatPasswordEle, "123")
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()
    })
  })

  it("Should be disabled when password mismatch", async () => {
    const { user } = renderWithProviders(<SignupForm />, { route: "/signup" })
    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

    const inputEle = screen.getByLabelText("Employee ID")
    const passwordEle = screen.getByLabelText("Password")
    const repeatPasswordEle = screen.getByLabelText("Re-enter password")

    await act(async () => {
      await user.type(inputEle, "123")
      await user.type(passwordEle, "password123")
      await user.type(repeatPasswordEle, "password")
    })
    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

    await act(async () => {
      await user.clear(repeatPasswordEle)
      await user.type(repeatPasswordEle, "password123")
    })
    expect(screen.getByRole("button", { name: "Sign up" })).toBeEnabled()
  })
})