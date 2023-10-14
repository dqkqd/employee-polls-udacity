import { EntityState } from "@reduxjs/toolkit"
import {
  getQuestions,
  getUsers,
  saveQuestion,
  saveQuestionAnswer,
  saveUser,
} from "../api"
import { AuthedUser, Question, User } from "../interfaces"
import { AnswerId } from "./../interfaces/index"

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
  {
    optionOneText: "fake-question-3-option-one",
    optionTwoText: "fake-question-3-option-two",
    author: fakeUsers[1].id,
  },
]

const fakeQuestionsAnswers = [
  {
    userIndex: 0,
    questionIndex: 2, // fake-question-3
    answerId: "optionOne",
  },
]

export const initialAuth: AuthedUser = { ...fakeUsers[0], status: "success" }

const setupTestData = async () => {
  const addedUsers = await Promise.all(
    fakeUsers.map(async (user) => await saveUser(user)),
  )

  const addedQuestions = await Promise.all(
    fakeQuestions.map(async (question) => await saveQuestion(question)),
  )

  const addedAnswer = await Promise.all(
    fakeQuestionsAnswers.map(
      async ({ userIndex, questionIndex, answerId }) =>
        await saveQuestionAnswer({
          authedUser: addedUsers[userIndex].id,
          qid: addedQuestions[questionIndex].id,
          answerId: answerId as AnswerId,
        }),
    ),
  )

  if (!addedAnswer.every(Boolean)) {
    throw new Error("Some questions answer are not added")
  }

  const [allUsers, allQuestions] = await Promise.all([
    getUsers(),
    getQuestions(),
  ])
  const initialUsers: EntityState<User> = {
    ids: Object.keys(allUsers),
    entities: allUsers,
  }
  const initialQuestions: EntityState<Question> = {
    ids: Object.keys(allUsers),
    entities: allQuestions,
  }

  // need to fetch added users and added questions again because we added answer
  const addedUserIds = addedUsers.map((user) => user.id)
  const fetchAddedUsers = Object.values(allUsers).filter((user) =>
    addedUserIds.includes(user.id),
  )
  const addedQuestionIds = addedQuestions.map((question) => question.id)
  const fetchAddedQuestions = Object.values(allQuestions).filter((question) =>
    addedQuestionIds.includes(question.id),
  )

  return {
    initialUsers,
    initialQuestions,
    addedUsers: fetchAddedUsers,
    addedQuestions: fetchAddedQuestions,
  }
}

export const { initialUsers, initialQuestions, addedUsers, addedQuestions } =
  await setupTestData()
