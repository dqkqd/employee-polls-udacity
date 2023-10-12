import { screen } from "@testing-library/react"
import { it } from "vitest"
import { initialAuth, initialUsers } from "../utils/test-data"
import { renderDefault } from "../utils/test-utils"

describe("Authorization", () => {
  it("User will be redirected to /login if unauthorized", () => {
    renderDefault({ route: "/home" })
    expect(screen.getByLabelText("log-in-page-title")).toHaveTextContent(
      "Log In",
    )
  })

  it("User will not be redirected to /login if authorized", () => {
    renderDefault({
      preloadedState: { users: initialUsers, auth: initialAuth },
      route: "/home",
    })
    expect(screen.getByText(`Hello ${initialAuth.name}`)).toBeInTheDocument()
  })
})

describe("Test navbar", () => {
  it.only("Render", () => {
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
})
