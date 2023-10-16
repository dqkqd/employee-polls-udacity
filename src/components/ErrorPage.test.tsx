import { act, screen, waitFor } from "@testing-library/react"
import { initialAuth, initialUsers } from "../utils/test-data"
import { renderDefault } from "../utils/test-utils"

it("Render", () => {
  renderDefault({ route: "/invalid-route" })
  expect(
    screen.getByRole("heading", { level: 1, name: "Oops!" }),
  ).toBeInTheDocument()
  expect(
    screen.getByText("Sorry, an unexpected error has occurred."),
  ).toBeInTheDocument()
})

it("Unauthorized will be redirected to login page", async () => {
  const { user } = renderDefault({ route: "/invalid-route" })
  await act(async () => {
    await user.click(screen.getByText("Go to login page"))
  })
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })
})

it("Authorized will be redirected to home", async () => {
  const auth = initialAuth
  const { user } = renderDefault({
    route: "/invalid-route",
    preloadedState: { users: initialUsers, auth },
  })
  await act(async () => {
    await user.click(screen.getByText("Go back home"))
  })
  await waitFor(() => {
    expect(
      screen.getByRole("heading", { level: 4, name: `Hello, ${auth.name}` }),
    ).toBeInTheDocument()
  })
})

it("Automatically redirected after 5 seconds", async () => {
  renderDefault({ route: "/invalid-route" })
  await waitFor(
    () => {
      expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
    },
    { timeout: 10000 },
  )
}, 10000)

it("Show nav bar on error page if user logged in", async () => {
  renderDefault({
    route: "/invalid-route",
    preloadedState: { users: initialUsers, auth: initialAuth },
  })
  expect(
    screen.getByRole("heading", { level: 1, name: "Oops!" }),
  ).toBeInTheDocument()
  expect(
    screen.getByText("Sorry, an unexpected error has occurred."),
  ).toBeInTheDocument()

  expect(screen.getByRole("tab", { name: "HOME" })).toBeInTheDocument()
  expect(screen.getByRole("tab", { name: "LEADERBOARD" })).toBeInTheDocument()
  expect(screen.getByRole("tab", { name: "NEW QUESTION" })).toBeInTheDocument()

  expect(screen.getByLabelText("user-nav-icon")).toHaveTextContent(
    initialAuth.name as string,
  )
  expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument()
})
