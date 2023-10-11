import { act, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { saveUser } from "../../api"
import { User } from "../../interfaces"
import { renderDefault } from "../../utils/test-utils"

let employee: User

beforeAll(async () => {
  employee = await saveUser({
    id: "1234",
    name: "John Wick",
    password: "password123",
    avatarURL: "https://picsum.photos/200",
  })
})

describe("Test login form", () => {
  it("Render", () => {
    renderDefault({ route: "/login" })

    expect(screen.getByLabelText("log-in-page-title")).toHaveTextContent(
      "Log In",
    )
    expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })

  describe("Input", () => {
    it("Write to form should change text", async () => {
      const { user } = renderDefault({ route: "/login" })

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
  })

  describe("Button", () => {
    it("Button is disabled until inputs are not empty", async () => {
      const { user } = renderDefault({ route: "/login" })

      const inputId = screen.getByLabelText("Employee ID")
      const password = screen.getByLabelText("Password")
      const button = screen.getByRole("button", { name: "Log In" })

      expect(button).toBeDisabled()

      await act(async () => {
        await user.type(inputId, "@fake-user-id")
      })
      expect(button).toBeDisabled()

      await act(async () => {
        await user.type(password, "@fake-password")
      })
      expect(button).toBeEnabled()
    })

    it("Navigate to '/' if user existed", async () => {
      const { user } = renderDefault({ route: "/login" })

      await act(async () => {
        await user.type(screen.getByLabelText("Employee ID"), employee.id)
        await user.type(screen.getByLabelText("Password"), employee.password)
        await user.click(screen.getByRole("button", { name: "Log In" }))
      })

      await waitFor(() => {
        expect(screen.getByText(`Hello ${employee.name}`)).toBeInTheDocument()
      })
    })

    test.each([
      { id: "incorrect-id", password: "incorrect-password" },
      { id: "1234", password: "incorrect-password" },
      { id: "incorrect-id", password: "password123" },
    ])(
      "Show error message when wrong username or password",
      async ({ id, password }) => {
        const { user } = renderDefault({ route: "/login" })

        await act(async () => {
          await user.type(screen.getByLabelText("Employee ID"), id)
          await user.type(screen.getByLabelText("Password"), password)
          await user.click(screen.getByRole("button", { name: "Log In" }))
        })

        await waitFor(() => {
          expect(
            screen.getByText(/incorrect employee id or password/i),
          ).toBeInTheDocument()
        })
      },
    )
  })
})
