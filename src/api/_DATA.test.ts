import type { AnswerId, Question, User } from "./../interfaces/index"
import {
  _getQuestions,
  _getUser,
  _getUsers,
  _saveQuestion,
  _saveQuestionAnswer,
  _saveUser,
} from "./_DATA"

import { describe, expect, it } from "vitest"

let userInDb: User
let questionInDb: Question
let randomUserId: string
let randomQuestionId: string

beforeAll(async () => {
  const [users, questions] = await Promise.all([_getUsers(), _getQuestions()])
  userInDb = Object.values(users)[0]
  questionInDb = Object.values(questions)[0]
})

beforeEach(() => {
  randomUserId = crypto.randomUUID()
  randomQuestionId = crypto.randomUUID()
})

describe("Test save questions", () => {
  it("success", async () => {
    const question = await _saveQuestion({
      optionOneText: "option1",
      optionTwoText: "option2",
      author: userInDb.id,
    })

    expect(question).toMatchObject({
      author: userInDb.id,
      optionOne: { votes: [], text: "option1" },
      optionTwo: { votes: [], text: "option2" },
    })

    await expect(_getQuestions()).resolves.toHaveProperty(question.id)
  })

  describe("failed", () => {
    it("author must be existed to add question", async () => {
      const userId = crypto.randomUUID()
      await expect(
        _saveQuestion({
          optionOneText: "option1",
          optionTwoText: "option2",
          author: userId,
        }),
      ).rejects.toBe(`User id '${userId}' does not exist`)
    })

    describe("empty, null or undefined arguments should be rejected", () => {
      test.each([
        ["", "option2", "author1"],
        [undefined, "option2", "author1"],
        [null, "option2", "author1"],
        ["option1", "", "author1"],
        ["option1", undefined, "author1"],
        ["option1", null, "author1"],
        ["option1", "option2", ""],
        ["option1", "option2", undefined],
        ["option1", "option2", null],
      ])(
        "optionOneText is '%s', optionTwoText is '%s', author is '%s'",
        async (optionOneText, optionTwoText, author) => {
          await expect(
            _saveQuestion({
              optionOneText,
              optionTwoText,
              author,
            }),
          ).rejects.toEqual(
            "Please provide optionOneText, optionTwoText, and author",
          )
        },
      )
    })

    it("New added options should be different", async () => {
      await expect(
        _saveQuestion({
          optionOneText: "abc",
          optionTwoText: "abc",
          author: userInDb.id,
        }),
      ).rejects.toEqual("Options must be different")
    })
  })
})

describe("Test save and get user", () => {
  it("success", async () => {
    const user = await _saveUser({
      id: randomUserId,
      name: "abc",
      password: "pw123",
      avatarURL: "https://picsum.photos/200",
    })

    await expect(_getUser(user.id)).resolves.toStrictEqual(user)
  })

  describe("failed", () => {
    describe("arguments should not be empty", () => {
      test.each([
        { id: "", name: "abc", password: "pw123" },
        { id: "123", name: "", password: "pw123" },
        { id: "123", name: "abc", password: "" },
      ])(
        "id is $id, name is $name, password is $password",
        async ({ id, name, password }) => {
          await expect(_saveUser({ id, name, password })).rejects.toBe(
            "Please provide id, name, password",
          )
        },
      )
    })

    it("save user already existed", async () => {
      await expect(
        _saveUser({ id: userInDb.id, name: "abc", password: "pw123" }),
      ).rejects.toBe("User already existed")
    })

    it("get user does not exist", async () => {
      await expect(_getUser(randomUserId)).rejects.toBe(
        `User id '${randomUserId}' does not exist`,
      )
    })
  })
})

describe("Test save question's answers", () => {
  describe("success", () => {
    test.each(["optionOne", "optionTwo"])(
      "answerId is '%s'",
      async (answerId) => {
        const newUser = await _saveUser({
          id: crypto.randomUUID(),
          password: "123",
          name: "123",
        })

        const userId = newUser.id
        const questionId = Object.values(await _getQuestions())[0].id

        await expect(
          _saveQuestionAnswer({
            authedUser: userId,
            qid: questionId,
            answerId: answerId as AnswerId,
          }),
        ).resolves.toBe(true)

        const questions = await _getQuestions()
        expect(
          questions[questionId][answerId as AnswerId].votes,
          // eslint-disable-next-line jest/valid-expect
        ).to.include(userId)

        const users = await _getUsers()
        expect(users[userId].answers[questionId]).toStrictEqual(answerId)
      },
    )
  })

  describe("failed", () => {
    describe("arguments should not be empty, null or undefined", () => {
      test.each(["", null, undefined])(
        "authedUser is '%s'",
        async (authedUser) => {
          await expect(
            _saveQuestionAnswer({
              authedUser,
              qid: questionInDb.id,
              answerId: "optionOne",
            }),
          ).rejects.toEqual("Please provide authedUser, qid, and answer")
        },
      )

      test.each(["", null, undefined])("qid is '%s'", async (qid) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userInDb.id,
            qid,
            answerId: "optionOne",
          }),
        ).rejects.toEqual("Please provide authedUser, qid, and answer")
      })

      test.each(["", null, undefined])("answerId is '%s'", async (answerId) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userInDb.id,
            qid: questionInDb.id,
            answerId: answerId as AnswerId,
          }),
        ).rejects.toEqual("Please provide authedUser, qid, and answer")
      })
    })

    describe("valid arguments but do not exist", () => {
      it("answerId should be optionOne or optionTwo", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userInDb.id,
            qid: questionInDb.id,
            answerId: "optionThree" as AnswerId,
          }),
        ).rejects.toBe(
          "Answer should be 'optionOne' or 'optionTwo', not 'optionThree'",
        )
      })

      it("user should exist in database", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: randomUserId,
            qid: questionInDb.id,
            answerId: "optionOne",
          }),
        ).rejects.toBe(`User id '${randomUserId}' does not exist`)
      })

      it("question id should exist in database", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userInDb.id,
            qid: randomQuestionId,
            answerId: "optionOne",
          }),
        ).rejects.toBe(`Question id '${randomQuestionId}' does not exist`)
      })
    })
  })
})
