import { act, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderWithProviders } from "../../utils/test-utils"
import LoginForm from "./LoginForm"

describe("Test login form", () => {
  it("Render", () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })

  describe("Input", () => {
    it("Write to form should change text", async () => {
      const { user } = renderWithProviders(<LoginForm />)

      const inputId = screen.getByLabelText("Employee ID")
      expect(inputId).toHaveDisplayValue("")
      await act(async () => {
        await user.type(inputId, "@fake-user-id")
      })
      expect(inputId).toHaveDisplayValue("@fake-user-id")

      const password = screen.getByLabelText("Password")
      expect(password).toHaveDisplayValue("")
      await act(async () => {
        await user.type(password, "@fake-password")
      })
      expect(password).toHaveDisplayValue("@fake-password")
    })

    it("Toggle should show / hide password", async () => {
      const { user } = renderWithProviders(<LoginForm />)

      const password = screen.getByLabelText("Password")
      await act(async () => {
        await user.type(password, "@fake-password")
      })
      expect(password).toHaveAttribute("type", "password")

      const toggleButton = within(
        screen.getByTestId("login-form-input-password"),
      ).getByRole("button")
      await act(async () => {
        await user.click(toggleButton)
      })
      expect(password).toHaveAttribute("type", "text")

      await act(async () => {
        await user.click(toggleButton)
      })
      expect(password).toHaveAttribute("type", "password")
    })
  })

  describe("Button", () => {
    it("Button is disabled until inputs are not empty", async () => {
      const { user } = renderWithProviders(<LoginForm />)

      expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled()

      const inputId = screen.getByLabelText("Employee ID")
      await act(async () => {
        await user.type(inputId, "@fake-user-id")
      })
      expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled()

      const password = screen.getByLabelText("Password")
      await act(async () => {
        await user.type(password, "@fake-password")
      })
      expect(screen.getByRole("button", { name: "Log In" })).toBeEnabled()
    })

    it("Navigate to '/' if user existed", async () => {
      const { user } = renderWithProviders(<LoginForm />)

      const inputId = screen.getByLabelText("Employee ID")
      await act(async () => {
        await user.type(inputId, "@fake-user-1")
      })

      const password = screen.getByLabelText("Password")
      await act(async () => {
        await user.type(password, "@fake-user-1-password")
      })

      const loginButton = screen.getByRole("button", { name: "Log In" })
      await act(async () => {
        await user.click(loginButton)
      })

      expect(screen.queryByLabelText("Employee ID")).not.toBeInTheDocument()
      expect(screen.queryByLabelText("Password")).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Log In" }),
      ).not.toBeInTheDocument()
    })

    test.each([
      { id: "@wrong-user-1", password: "@wrong-user-1-password" },
      { id: "@fake-user-1", password: "@wrong-user-1-password" },
      { id: "@wrong-user-1", password: "@fake-user-1-password" },
    ])(
      "Show error message when wrong username or password",
      async ({ id, password }) => {
        const { user } = renderWithProviders(<LoginForm />)

        const idEle = screen.getByLabelText("Employee ID")
        await act(async () => {
          await user.type(idEle, id)
        })

        const passwordEle = screen.getByLabelText("Password")
        await act(async () => {
          await user.type(passwordEle, password)
        })

        const loginButton = screen.getByRole("button", { name: "Log In" })
        await act(async () => {
          await user.click(loginButton)
        })

        expect(
          screen.getByText(/incorrect employee id or password/i),
        ).toBeInTheDocument()
        expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
        expect(
          screen.getByRole("button", { name: "Log In" }),
        ).toBeInTheDocument()
      },
    )
  })
})
