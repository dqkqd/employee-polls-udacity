import { act, screen } from "@testing-library/react"
import { it } from "vitest"
import { getQuestions, getUsers } from "../../api"
import { AnswerId, UserId } from "../../interfaces"
import {
  initialAuth,
  initialQuestions,
  initialUsers,
} from "../../utils/test-data"
import { renderDefault } from "../../utils/test-utils"

it("Test render", async () => {
  const question = Object.values(initialQuestions.entities)[0]
  if (!question) {
    throw new Error("question must be defined")
  }

  const author = initialUsers.entities[question.author]
  if (!author) {
    throw new Error("author must be defined")
  }

  renderDefault({
    route: `/questions/${question.id}`,
    preloadedState: {
      users: initialUsers,
      questions: initialQuestions,
      auth: initialAuth,
    },
  })

  expect(screen.getByText(`Poll by ${author.name}`)).toBeInTheDocument()
  expect(screen.getByText("Would you rather")).toBeInTheDocument()
  expect(screen.getByText(question.optionOne.text)).toBeInTheDocument()
  expect(screen.getByText(question.optionTwo.text)).toBeInTheDocument()
  expect(screen.getAllByRole("button", { name: /vote/i })).toHaveLength(2)
})

test.each(["optionOne", "optionTwo"])(
  "Successfully adding answer %s",
  async (answerId) => {
    const question = Object.values(initialQuestions.entities)[1]
    if (!question) {
      throw new Error("question must be defined")
    }

    const auth = initialAuth

    const { store, user } = renderDefault({
      route: `/questions/${question.id}`,
      preloadedState: {
        users: initialUsers,
        questions: initialQuestions,
        auth,
      },
    })

    const buttons = screen.getAllByRole("button", { name: /vote/i })
    const button = answerId === "optionOne" ? buttons[0] : buttons[1]

    await act(async () => {
      await user.click(button)
    })

    // make sure everything is added into database
    await act(async () => {
      await expect(
        getUsers().then(
          (users) => users[auth.id as UserId].answers[question.id],
        ),
      ).resolves.toBe(answerId)

      await expect(
        getQuestions().then(
          (questions) => questions[question.id].optionOne.votes,
        ),
        // eslint-disable-next-line jest/valid-expect
      ).resolves.to.includes(auth.id)
    })

    // make sure everything is added into store
    expect(
      store.getState().questions.entities[question.id]?.[answerId as AnswerId]
        .votes,
      // eslint-disable-next-line jest/valid-expect
    ).to.includes(auth.id)

    expect(
      store.getState().users.entities[auth.id as UserId]?.answers[question.id],
    ).toBe(answerId)
  },
)
