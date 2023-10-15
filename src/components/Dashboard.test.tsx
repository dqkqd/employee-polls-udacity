import { act, screen, waitFor } from "@testing-library/react"
import { it } from "vitest"
import { initialAuth, initialUsers } from "../utils/test-data"
import { renderDefault } from "../utils/test-utils"

describe("Test navbar", () => {
  it("Render", () => {
    renderDefault({
      preloadedState: { users: initialUsers, auth: initialAuth },
      route: "/",
    })

    expect(screen.getByRole("tab", { name: "HOME" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "LEADERBOARD" })).toBeInTheDocument()
    expect(
      screen.getByRole("tab", { name: "NEW QUESTION" }),
    ).toBeInTheDocument()

    expect(screen.getByLabelText("user-nav-icon")).toHaveTextContent(
      initialAuth.name as string,
    )
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument()
  })

  it("Should logout user and move to login page when click logout button", async () => {
    const { user } = renderDefault({
      preloadedState: { users: initialUsers, auth: initialAuth },
      route: "/",
    })

    await act(async () => {
      user.click(screen.getByRole("button", { name: "Log out" }))
    })

    await waitFor(() => {
      expect(screen.getByLabelText("log-in-page-title")).toHaveTextContent(
        "Log In",
      )
    })
  })

  it("Should display home when clicking home", async () => {
    const { user } = renderDefault({
      preloadedState: { users: initialUsers, auth: initialAuth },
      route: "/leaderboard",
    })

    await act(async () => {
      user.click(screen.getByRole("tab", { name: "HOME" }))
    })

    await waitFor(() => {
      expect(screen.getByText(`Hello, ${initialAuth.name}`)).toBeInTheDocument()
    })

    expect(
      screen.getByRole("tab", { name: "HOME", selected: true }),
    ).toBeInTheDocument()
  })

  it("Should display leaderboard when clicking leaderboard", async () => {
    const { user } = renderDefault({
      preloadedState: { users: initialUsers, auth: initialAuth },
      route: "/home",
    })

    await act(async () => {
      user.click(screen.getByRole("tab", { name: "LEADERBOARD" }))
    })

    await waitFor(() => {
      expect(screen.getByText("Welcome to leaderboard")).toBeInTheDocument()
    })

    expect(
      screen.getByRole("tab", { name: "LEADERBOARD", selected: true }),
    ).toBeInTheDocument()
  })

  it("Should display new question when clicking new question", async () => {
    const { user } = renderDefault({
      preloadedState: { users: initialUsers, auth: initialAuth },
      route: "/home",
    })

    await act(async () => {
      user.click(screen.getByRole("tab", { name: "NEW QUESTION" }))
    })

    await waitFor(() => {
      expect(screen.getByText(/create your own poll/i)).toBeInTheDocument()
    })

    expect(
      screen.getByRole("tab", { name: "NEW QUESTION", selected: true }),
    ).toBeInTheDocument()
  })
})
