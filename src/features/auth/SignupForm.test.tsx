import { act, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "../../utils/test-utils"
import SignupForm from "./SignupForm"

describe("Test signup form", () => {
  it("Render", () => {
    renderWithProviders(<SignupForm />, { route: "/signup" })

    expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Avatar URL")).toBeInTheDocument()
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

      const nameEle = screen.getByLabelText("Name")
      expect(nameEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(nameEle, "@new-user-name")
      })
      expect(nameEle).toHaveDisplayValue("@new-user-name")

      const avatarEle = screen.getByLabelText("Avatar URL")
      expect(avatarEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(avatarEle, "@new-user-avatar")
      })
      expect(avatarEle).toHaveDisplayValue("@new-user-avatar")

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
      const nameEle = screen.getByLabelText("Name")
      const passwordEle = screen.getByLabelText("Password")
      const repeatPasswordEle = screen.getByLabelText("Re-enter password")

      await act(async () => {
        await user.type(inputEle, "123")
        await user.type(nameEle, "123")
        await user.type(passwordEle, "123")
        await user.type(repeatPasswordEle, "123")
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeEnabled()

      await act(async () => {
        await user.clear(inputEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      await act(async () => {
        await user.type(inputEle, "123")
        await user.clear(nameEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      await act(async () => {
        await user.type(nameEle, "123")
        await user.clear(passwordEle)
        await user.clear(repeatPasswordEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()
    })
  })

  it("Should be disabled when password mismatch", async () => {
    const { user } = renderWithProviders(<SignupForm />, { route: "/signup" })
    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

    const inputEle = screen.getByLabelText("Employee ID")
    const nameEle = screen.getByLabelText("Name")
    const passwordEle = screen.getByLabelText("Password")
    const repeatPasswordEle = screen.getByLabelText("Re-enter password")

    await act(async () => {
      await user.type(inputEle, "123")
      await user.type(nameEle, "123")
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

  describe("Signup", () => {
    it.only("Loading should disable form and button", async () => {
      const { user } = renderWithProviders(<SignupForm />, { route: "/signup" })

      const inputEle = screen.getByLabelText("Employee ID")
      const nameEle = screen.getByLabelText("Name")
      const passwordEle = screen.getByLabelText("Password")
      const repeatPasswordEle = screen.getByLabelText("Re-enter password")

      await act(async () => {
        await user.type(inputEle, "123")
        await user.type(nameEle, "123")
        await user.type(passwordEle, "password123")
        await user.type(repeatPasswordEle, "password123")
      })

      const button = screen.getByRole("button", { name: "Sign up" })
      await act(async () => {
        await user.click(button)
      })
      expect(screen.getByTestId("signup-loading")).toBeInTheDocument()
      expect(inputEle).toBeDisabled()
      expect(nameEle).toBeDisabled()
      expect(button).toBeDisabled()
    })
    it.todo("Successfully signup")
    it.todo("Cannot signup when user id existed")
    it.todo("Should show error on failure")
  })
})
