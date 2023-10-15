import { screen, within } from "@testing-library/react"
import { User } from "../interfaces"
import { initialAuth, initialQuestions, initialUsers } from "../utils/test-data"
import { renderWithNoRoutes } from "../utils/test-utils"
import Leaderboard from "./Leaderboard"

it("Render", () => {
  renderWithNoRoutes(<Leaderboard />, {
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth: initialAuth,
    },
  })
  const users = Object.values(initialUsers.entities)
    .filter((user): user is User => user !== undefined)
    .sort((lhs, rhs) => {
      const lhsScore = Object.keys(lhs.answers).length + lhs.questions.length
      const rhsScore = Object.keys(rhs.answers).length + rhs.questions.length
      return rhsScore - lhsScore
    })

  expect(
    screen.getByRole("heading", { level: 4, name: "Leader Board" }),
  ).toBeInTheDocument()

  const rows = screen.getAllByRole("row")

  // ignore the first row which is header
  const trs = rows.slice(1)

  expect(trs).toHaveLength(6)

  // verify users order
  trs.forEach((tr, index) => {
    const user = users[index]

    const cells = within(tr).getAllByRole("cell")
    expect(cells).toHaveLength(4)

    expect(user.name).toBe(cells[1].textContent)
    expect(Object.keys(user.answers)).toHaveLength(
      parseInt(cells[2].textContent as string),
    )
    expect(user.questions).toHaveLength(
      parseInt(cells[3].textContent as string),
    )
  })
})
