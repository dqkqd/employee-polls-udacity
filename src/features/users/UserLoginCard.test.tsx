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
    expect(screen.getByText(`Hello ${employee.name}`)).toBeInTheDocument()
  })
})
