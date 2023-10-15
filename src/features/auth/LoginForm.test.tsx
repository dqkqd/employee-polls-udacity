import { act, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { UserNotFoundError } from "../../errors"
import { initialUsers } from "../../utils/test-data"
import { renderDefault, renderWithNoRoutes } from "../../utils/test-utils"
import LoginForm from "./LoginForm"

const employee = Object.values(initialUsers.entities)[0]
if (!employee) {
  throw new UserNotFoundError(employee)
}

it("Render", () => {
  const { baseElement } = renderWithNoRoutes(<LoginForm />)
  expect(baseElement).toMatchSnapshot()

  expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
  expect(screen.getByLabelText("Password")).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
})

it("Write to form should change text", async () => {
  const { user } = renderWithNoRoutes(<LoginForm />)

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

it("Button is disabled until inputs are not empty", async () => {
  const { user } = renderWithNoRoutes(<LoginForm />)

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

describe("Login", () => {
  it("Loading should disable form and button", async () => {
    const { user } = renderWithNoRoutes(<LoginForm />)

    const inputEle = screen.getByLabelText("Employee ID")
    const passwordEle = screen.getByLabelText("Password")
    const button = screen.getByRole("button", { name: "Log In" })

    await act(async () => {
      await user.type(inputEle, employee.id)
      await user.type(passwordEle, employee.password)
      await user.click(button)
    })

    expect(screen.getByTestId("login-loading")).toBeInTheDocument()
    expect(inputEle).toBeDisabled()
    expect(passwordEle).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it("Navigate to '/' if user existed", async () => {
    const { user } = renderDefault({ route: "/login" })

    await act(async () => {
      await user.type(screen.getByLabelText("Employee ID"), employee.id)
      await user.type(screen.getByLabelText("Password"), employee.password)
      await user.click(screen.getByRole("button", { name: "Log In" }))
    })

    await waitFor(() => {
      expect(screen.getByText(`Hello, ${employee.name}`)).toBeInTheDocument()
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

describe("Navigate", () => {
  it("Navigate to signup page", async () => {
    const { user } = renderDefault({ route: "/login" })
    await act(async () => {
      await user.click(screen.getByText("Sign up"))
    })

    await waitFor(() => {
      expect(screen.getByLabelText("sign-up-page-title")).toBeInTheDocument()
    })
  })

  it("Navigate to select login users", async () => {
    const { user } = renderDefault({ route: "/login" })
    await act(async () => {
      await user.click(screen.getByText("Login using a sample account"))
    })

    await waitFor(() => {
      expect(screen.getByText("Select employee to login")).toBeInTheDocument()
    })
  })
})

describe("Keep previous location", () => {
  it("valid route", async () => {
    const { store, user } = renderDefault({ route: "/leaderboard" })
    await waitFor(async () => {
      expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
    })

    const { users } = store.getState()
    const employeeId = users.ids[0]
    const employeePassword = users.entities[employeeId]?.password

    await act(async () => {
      await user.type(
        screen.getByLabelText("Employee ID"),
        employeeId as string,
      )
      await user.type(
        screen.getByLabelText("Password"),
        employeePassword as string,
      )

      await user.click(screen.getByRole("button", { name: "Log In" }))
    })

    // we should inside leaderboard instead of home
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 4, name: "Leader Board" }),
      ).toBeInTheDocument()
    })
  })

  it("Invalid route", async () => {
    const { store, user } = renderDefault({ route: "/questions/1234" })
    await waitFor(async () => {
      expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
    })

    const { users } = store.getState()
    const employeeId = users.ids[0]
    const employeePassword = users.entities[employeeId]?.password

    await act(async () => {
      await user.type(
        screen.getByLabelText("Employee ID"),
        employeeId as string,
      )
      await user.type(
        screen.getByLabelText("Password"),
        employeePassword as string,
      )

      await user.click(screen.getByRole("button", { name: "Log In" }))
    })

    // we should inside error page instead of home
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "Oops!" }),
      ).toBeInTheDocument()
    })
  })
})
