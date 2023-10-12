import { act, screen, waitFor } from "@testing-library/react"
import { expect, it } from "vitest"
import { initialUsers, setUpTestUsers } from "../../utils/test-data"
import { renderDefault } from "../../utils/test-utils"

it("Test login by selecting user", async () => {
  setUpTestUsers(initialUsers)

  const { user } = renderDefault({ route: "/login/users" })

  expect(screen.getByText("Select employee to login")).toBeInTheDocument()

  const avatars = screen.getAllByLabelText("user-login-avatar")
  expect(avatars).toHaveLength(initialUsers.ids.length)
  avatars.forEach((avatar) => expect(avatar).toBeInTheDocument())

  const names = screen.getAllByText(/^fake user/i)
  expect(names).toHaveLength(initialUsers.ids.length)
  expect(names[0]).toHaveTextContent("Fake User 1")
  expect(names[1]).toHaveTextContent("Fake User 2")

  await act(async () => {
    await user.click(names[0])
  })

  await waitFor(() => {
    expect(screen.getByText("Hello Fake User 1")).toBeInTheDocument()
  })
})
