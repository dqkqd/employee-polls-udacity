import type { QuestionsDictionary, UsersDictionary } from "../interfaces"
import type { AnswerId } from "./../interfaces/index"
import {
  _getQuestions,
  _getUsers,
  _saveQuestion,
  _saveQuestionAnswer,
} from "./_DATA"

import { describe, expect, it } from "vitest"

describe("Test save questions", () => {
  it("success", async () => {
    const users = await _getUsers()
    const author = Object.values(users)[0].id

    const question = await _saveQuestion({
      optionOneText: "option1",
      optionTwoText: "option2",
      author,
    })

    expect(question).toMatchObject({
      author,
      optionOne: { votes: [], text: "option1" },
      optionTwo: { votes: [], text: "option2" },
    })

    await expect(_getQuestions()).resolves.toHaveProperty(question.id)
  })

  describe("failed", () => {
    it("author must be existed to add question", async () => {
      await expect(
        _saveQuestion({
          optionOneText: "option1",
          optionTwoText: "option2",
          author: "123",
        }),
      ).rejects.toBe("User id '123' does not exist")
    })
  })

  describe("empty, null or undefined arguments should not be rejected", () => {
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
})

describe("Test save question's answers", () => {
  let users: UsersDictionary
  let questions: QuestionsDictionary

  beforeAll(async () => {
    users = await _getUsers()
    questions = await _getQuestions()
  })

  describe("success", () => {
    test.each(["optionOne", "optionTwo"])(
      "answerId is '%s'",
      async (answerId) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid: Object.values(questions)[0].id,
            answerId: answerId as AnswerId,
          }),
        ).resolves.toBe(true)
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
              qid: Object.values(questions)[0].id,
              answerId: "optionOne",
            }),
          ).rejects.toEqual("Please provide authedUser, qid, and answer")
        },
      )

      test.each(["", null, undefined])("qid is '%s'", async (qid) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid,
            answerId: "optionOne",
          }),
        ).rejects.toEqual("Please provide authedUser, qid, and answer")
      })

      test.each(["", null, undefined])("answerId is '%s'", async (answerId) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid: Object.values(questions)[0].id,
            answerId: answerId as AnswerId,
          }),
        ).rejects.toEqual("Please provide authedUser, qid, and answer")
      })
    })

    describe("valid arguments but do not exist", () => {
      it("answerId should be optionOne or optionTwo", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid: Object.values(questions)[0].id,
            answerId: "optionThree" as AnswerId,
          }),
        ).rejects.toBe(
          "Answer should be 'optionOne' or 'optionTwo', not 'optionThree'",
        )
      })

      it("user should exist in database", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: "123",
            qid: Object.values(questions)[0].id,
            answerId: "optionOne",
          }),
        ).rejects.toBe("User id '123' does not exist")
      })

      it("question id should exist in database", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid: "123",
            answerId: "optionThree" as AnswerId,
          }),
        ).rejects.toBe("Question id '123' does not exist")
      })
    })
  })
})
