import { act, screen, waitFor } from "@testing-library/react"
import { expect, it } from "vitest"
import { addedUsers } from "../../utils/test-data"
import { renderDefault, renderWithNoRoutes } from "../../utils/test-utils"
import UserLoginCard from "./UserLoginCard"

it("Render", async () => {
  const employee = addedUsers[0]
  renderWithNoRoutes(<UserLoginCard id={employee.id} />)

  expect(screen.getByRole("img")).toHaveAttribute("src", employee.avatarURL)
  expect(screen.getByText(employee.name)).toBeInTheDocument()
})

it("Click card should allow to login", async () => {
  const employee = addedUsers[0]
  const { user } = renderDefault({ route: "/login/users" })

  await act(async () => {
    await user.click(screen.getByText(employee.name))
  })

  await waitFor(() => {
    expect(screen.getByText(`Hello, ${employee.name}`)).toBeInTheDocument()
  })
})

describe("Keep previous location", () => {
  it("default route", async () => {
    const { user } = renderDefault({ route: "/" })
    await act(async () => {
      await user.click(screen.getByText("Login using a sample account"))
    })

    const employee = addedUsers[0]
    await act(async () => {
      await user.click(screen.getByText(employee.name))
    })

    // we should inside home instead
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 4,
          name: `Hello, ${employee.name}`,
        }),
      ).toBeInTheDocument()
    })
  })

  it("valid route", async () => {
    const { user } = renderDefault({ route: "/leaderboard" })
    await act(async () => {
      await user.click(screen.getByText("Login using a sample account"))
    })

    const employee = addedUsers[0]
    await act(async () => {
      await user.click(screen.getByText(employee.name))
    })

    // we should inside leaderboard instead of home
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 4, name: "Leader Board" }),
      ).toBeInTheDocument()
    })
  })

  it("Invalid route", async () => {
    const { user } = renderDefault({ route: "/questions/1234" })

    await act(async () => {
      await user.click(screen.getByText("Login using a sample account"))
    })

    const employee = addedUsers[0]
    await act(async () => {
      await user.click(screen.getByText(employee.name))
    })

    // we should inside error page instead of home
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: "Oops!" }),
      ).toBeInTheDocument()
    })
  })
})
