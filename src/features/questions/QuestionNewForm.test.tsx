import { act, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { getQuestions, getUser } from "../../api"
import { Question, User } from "../../interfaces"
import {
  initialAuth,
  initialQuestions,
  initialUsers,
} from "../../utils/test-data"
import { renderDefault, renderWithNoRoutes } from "../../utils/test-utils"
import QuestionNewForm from "./QuestionNewForm"

it("Render", () => {
  const { baseElement } = renderWithNoRoutes(<QuestionNewForm />)
  expect(baseElement).toMatchSnapshot()

  expect(
    screen.getByRole("textbox", { name: "First option" }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole("textbox", { name: "Second option" }),
  ).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
})

describe("Input", () => {
  it("Write to form should change text", async () => {
    const { user } = renderWithNoRoutes(<QuestionNewForm />)

    const firstOptionEle = screen.getByRole("textbox", { name: "First option" })

    expect(firstOptionEle).toHaveDisplayValue("")
    await act(async () => {
      await user.type(firstOptionEle, "@new-question-option-1")
    })
    expect(firstOptionEle).toHaveDisplayValue("@new-question-option-1")

    const secondOptionEle = screen.getByRole("textbox", {
      name: "Second option",
    })
    expect(secondOptionEle).toHaveDisplayValue("")
    await act(async () => {
      await user.type(secondOptionEle, "@new-question-option-2")
    })
    expect(secondOptionEle).toHaveDisplayValue("@new-question-option-2")
  })
})

describe("Button", () => {
  it("Should be disabled when one of the input is empty", async () => {
    const { user } = renderWithNoRoutes(<QuestionNewForm />)
    const button = screen.getByRole("button", { name: "Submit" })
    expect(button).toBeDisabled()

    const firstOptionEle = screen.getByRole("textbox", { name: "First option" })
    const secondOptionEle = screen.getByRole("textbox", {
      name: "Second option",
    })

    await act(async () => {
      await user.type(firstOptionEle, "123")
      await user.clear(secondOptionEle)
    })
    expect(button).toBeDisabled()

    await act(async () => {
      await user.clear(firstOptionEle)
      await user.type(secondOptionEle, "123")
    })
    expect(button).toBeDisabled()

    await act(async () => {
      await user.type(firstOptionEle, "123")
      await user.type(secondOptionEle, "1234")
    })
    expect(button).toBeEnabled()
  })

  it("Should be disabled when options are the same", async () => {
    const { user } = renderWithNoRoutes(<QuestionNewForm />)
    const button = screen.getByRole("button", { name: "Submit" })

    const firstOptionEle = screen.getByRole("textbox", { name: "First option" })
    const secondOptionEle = screen.getByRole("textbox", {
      name: "Second option",
    })

    await act(async () => {
      await user.type(firstOptionEle, "123")
      await user.type(secondOptionEle, "123")
    })
    expect(button).toBeDisabled()
  })
})

describe("Error", () => {
  it("Should show error when two options are the same", async () => {
    const { user } = renderWithNoRoutes(<QuestionNewForm />)
    expect(
      screen.queryByText("Two options should be different"),
    ).not.toBeInTheDocument()

    const firstOptionEle = screen.getByRole("textbox", { name: "First option" })
    const secondOptionEle = screen.getByRole("textbox", {
      name: "Second option",
    })

    await act(async () => {
      await user.type(firstOptionEle, "123")
      await user.type(secondOptionEle, "123")
    })
    expect(
      screen.getByText("Two options should be different"),
    ).toBeInTheDocument()

    // with space
    await act(async () => {
      await user.clear(firstOptionEle)
      await user.type(firstOptionEle, "   123  ")
    })
    expect(
      screen.getByText("Two options should be different"),
    ).toBeInTheDocument()

    await act(async () => {
      await user.clear(firstOptionEle)
      await user.type(firstOptionEle, "1234")
    })
    expect(
      screen.queryByText("Two options should be different"),
    ).not.toBeInTheDocument()
  })
})

describe("Submit", () => {
  it("Successfully submit question", async () => {
    const auth = initialAuth

    const { store, user } = renderDefault({
      route: "/add",
      preloadedState: {
        users: initialUsers,
        questions: initialQuestions,
        auth,
      },
    })

    const firstOptionEle = screen.getByRole("textbox", { name: "First option" })
    const secondOptionEle = screen.getByRole("textbox", {
      name: "Second option",
    })
    const button = screen.getByRole("button", { name: "Submit" })

    await act(async () => {
      await user.type(firstOptionEle, "123")
      await user.type(secondOptionEle, "1234")
      await user.click(button)
    })

    // submitting up user, everything should be disabled
    expect(screen.getByTestId("add-question-loading")).toBeInTheDocument()
    expect(firstOptionEle).toBeDisabled()
    expect(secondOptionEle).toBeDisabled()
    expect(button).toBeDisabled()

    // should moved into question detail page
    await waitFor(() => {
      expect(screen.getByText(/poll by you/i)).toBeInTheDocument()
    })

    // question should be saved in the store
    const { questions, users } = store.getState()
    // new questions should be on top
    const questionId = questions.ids[0]
    const question = questions.entities[questionId] as Question

    // it should be created in less than 10 seconds ago
    const now = new Date().getTime()
    expect(now - question.timestamp).toBeLessThan(10000)

    const employee = users.entities[auth.id as string] as User
    expect(employee.questions).toContain(questionId)

    // new questions should be in store
    await act(async () => {
      const userFromDatabase = await getUser(auth.id as string)
      expect(userFromDatabase.questions).toContain(questionId)

      const questionFromDatabase = await getQuestions()
      expect(questionFromDatabase[questionId]).toBeDefined()
    })
  })
})
