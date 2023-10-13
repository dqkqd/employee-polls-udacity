import { EntityId, EntityState } from "@reduxjs/toolkit"
import { saveQuestion, saveUser } from "../api"
import { AuthedUser, Question, User } from "../interfaces"

const fakeUsers = [
  {
    id: "@fake-user-1",
    name: "Fake User 1",
    password: "@fake-user-1-password",
    avatarURL: "https://picsum.photos/200",
  },
  {
    id: "@fake-user-2",
    name: "Fake User 2",
    password: "@fake-user-2-password",
    avatarURL: "https://picsum.photos/200",
  },
]

const fakeQuestions = [
  {
    optionOneText: "fake-question-1-option-one",
    optionTwoText: "fake-question-1-option-two",
    author: fakeUsers[0].id,
  },
  {
    optionOneText: "fake-question-2-option-one",
    optionTwoText: "fake-question-2-option-two",
    author: fakeUsers[1].id,
  },
]

export const initialAuth: AuthedUser = { ...fakeUsers[0], status: "success" }

const setUpTestUsers = async (
  users = fakeUsers,
): Promise<EntityState<User>> => {
  return Promise.all(users.map(async (user) => await saveUser(user))).then(
    (formattedUsers) => {
      const ids = formattedUsers.map((user) => user.id as EntityId)
      const entities = Object.fromEntries(
        formattedUsers.map((user) => [user.id as EntityId, user]),
      )
      return { ids, entities }
    },
  )
}

const setUpTestQuestions = async (
  questions = fakeQuestions,
): Promise<EntityState<Question>> => {
  return Promise.all(
    questions.map(async (question) => await saveQuestion(question)),
  ).then((formattedQuestions) => {
    const ids = formattedQuestions.map((q) => q.id as EntityId)
    const entities = Object.fromEntries(
      formattedQuestions.map((q) => [q.id as EntityId, q]),
    )
    return { ids, entities }
  })
}

export const initialUsers = await setUpTestUsers()
export const initialQuestions = await setUpTestQuestions()
