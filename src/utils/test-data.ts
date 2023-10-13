import { EntityId, EntityState } from "@reduxjs/toolkit"
import { saveQuestion, saveUser } from "../api"
import { AuthedUser, Question, User } from "../interfaces"

export const initialUsers: EntityState<User> = {
  ids: ["@fake-user-1", "@fake-user-2"],
  entities: {
    "@fake-user-1": {
      id: "@fake-user-1",
      name: "Fake User 1",
      password: "@fake-user-1-password",
      avatarURL: "https://picsum.photos/200",
      questions: [],
      answers: {},
    },
    "@fake-user-2": {
      id: "@fake-user-2",
      name: "Fake User 2",
      password: "@fake-user-2-password",
      avatarURL: "https://picsum.photos/200",
      questions: [],
      answers: {},
    },
  },
}

const fakeQuestions = [
  {
    optionOneText: "fake-question-1-option-one",
    optionTwoText: "fake-question-1-option-two",
    author: initialUsers.ids[0] as string,
  },
  {
    optionOneText: "fake-question-2-option-one",
    optionTwoText: "fake-question-2-option-two",
    author: initialUsers.ids[1] as string,
  },
]

export const initialAuth: AuthedUser = {
  id: "@fake-user-1",
  name: "Fake User 1",
  password: "@fake-user-1-password",
  avatarURL: "https://picsum.photos/200",
  status: "success",
}

export const setUpTestUsers = async (users = initialUsers) => {
  for (const user of Object.values(users.entities)) {
    if (user) {
      const registerUser = { ...user, avatarURL: user.avatarURL ?? undefined }
      await saveUser(registerUser)
    }
  }
}

export const setUpTestQuestions = async (
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
