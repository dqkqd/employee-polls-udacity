import { act, screen } from "@testing-library/react"
import { PAGINATION_PER_PAGE } from "../../env"
import { Question } from "../../interfaces"
import { addedQuestions, initialQuestions } from "../../utils/test-data"
import { renderWithNoRoutes } from "../../utils/test-utils"
import QuestionList from "./QuestionList"

it("Render", () => {
  const questions = addedQuestions

  if (questions.length > PAGINATION_PER_PAGE) {
    throw new Error("too many questions to be render on the same page")
  }

  renderWithNoRoutes(
    <QuestionList title="My list" ids={questions.map((q) => q.id)} />,
  )

  expect(
    screen.getByRole("heading", { level: 5, name: "My list" }),
  ).toBeInTheDocument()

  for (const question of questions) {
    const questionCardsTitle = screen.getAllByRole("heading", {
      level: 5,
      name: question.author,
    })
    expect(questionCardsTitle.length > 0).toBeTruthy()
  }
})

it("Pagination", async () => {
  const questions = Object.values(initialQuestions.entities).filter(
    (q): q is Question => q !== undefined,
  )
  const authors = questions.map((q) => q.author)

  if (questions.length <= 6) {
    throw new Error("need more questions to test pagination")
  }

  const { user } = renderWithNoRoutes(
    <QuestionList title="My list" ids={questions.map((q) => q.id)} />,
  )

  const textContents = screen
    .getAllByRole("heading", {
      level: 5,
    })
    .map((heading) => heading.textContent)

  // the first one must be title, the next 6 ones are cards title
  expect(textContents).toHaveLength(PAGINATION_PER_PAGE + 1)
  expect(textContents[0]).toBe("My list")
  expect(authors).toEqual(expect.arrayContaining(textContents.slice(1)))

  // move to next page
  await act(async () => {
    await user.click(screen.getByRole("button", { name: "Go to page 2" }))
  })
  expect(screen.getByRole("button", { name: "page 2" })).toBeInTheDocument()

  const textContentsPage2 = screen
    .getAllByRole("heading", {
      level: 5,
    })
    .map((heading) => heading.textContent)

  expect(textContentsPage2.length).toBeTruthy()
  expect(textContentsPage2[0]).toBe("My list")
  expect(authors).toEqual(expect.arrayContaining(textContentsPage2.slice(1)))
})
