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
