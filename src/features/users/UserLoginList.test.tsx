import { screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { initialUsers } from "../../utils/test-data"
import { renderWithNoRoutes } from "../../utils/test-utils"
import UserLoginList from "./UserLoginList"

it("All employees should be shown", async () => {
  renderWithNoRoutes(<UserLoginList />)
  expect(screen.getAllByRole("img")).toHaveLength(initialUsers.ids.length)
})
