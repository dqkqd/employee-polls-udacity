import { saveUser } from "../api"
import { AuthedUser } from "../interfaces"

export const initialUsers = {
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

export const initialAuth: AuthedUser = {
  id: "@fake-user-1",
  name: "Fake User 1",
  password: "@fake-user-1-password",
  avatarURL: "https://picsum.photos/200",
  status: "success",
}

export const setUpTestUsers = async (users = initialUsers) => {
  for (const user of Object.values(users.entities)) {
    await saveUser(user)
  }
}
