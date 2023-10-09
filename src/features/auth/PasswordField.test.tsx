import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe } from "vitest"
import PasswordInput from "./PasswordField"

describe("Password Input", () => {
  test.each([
    { label: "", expectedLabel: "Password" },
    { label: undefined, expectedLabel: "Password" },
    { label: "Re-enter password", expectedLabel: "Re-enter password" },
  ])("Render label when defined", ({ label, expectedLabel }) => {
    render(
      <PasswordInput
        password=""
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setPassword={() => {}}
        label={label}
      />,
    )

    expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument()
  })

  it("Password should be updated", async () => {
    const user = userEvent.setup()

    let mockPassword = ""
    const mockSetPassword = (e: string) => {
      mockPassword += e
    }

    render(
      <PasswordInput
        password={mockPassword}
        setPassword={mockSetPassword as never}
      />,
    )

    const passwordEle = screen.getByLabelText("Password")
    await act(async () => {
      await user.type(passwordEle, "@fake-password")
    })
    expect(mockPassword).toBe("@fake-password")
  })

  it("Toggle should show / hide password", async () => {
    const user = userEvent.setup()

    render(
      <PasswordInput
        password="@fake-password"
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setPassword={() => {}}
      />,
    )

    const passwordEle = screen.getByLabelText("Password")
    expect(passwordEle).toHaveAttribute("type", "password")
    expect(passwordEle).toHaveDisplayValue("@fake-password")

    const toggleButton = within(
      screen.getByTestId("login-form-input-password"),
    ).getByRole("button")

    await act(async () => {
      await user.click(toggleButton)
    })
    expect(passwordEle).toHaveAttribute("type", "text")

    await act(async () => {
      await user.click(toggleButton)
    })
    expect(passwordEle).toHaveAttribute("type", "password")
  })
})
