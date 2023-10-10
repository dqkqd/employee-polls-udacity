import type { AnswerId } from "./../interfaces/index"
import {
  _getQuestions,
  _getUsers,
  _saveQuestion,
  _saveQuestionAnswer,
} from "./_DATA"

import { describe, expect, it } from "vitest"

describe("Test save questions", () => {
  let author: string
  beforeAll(async () => {
    const users = await _getUsers()
    author = Object.values(users)[0].id
  })

  it("success", async () => {
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
          author,
        }),
      ).rejects.toEqual("Options must be different")
    })
  })
})

describe("Test save question's answers", () => {
  let userId: string
  let questionId: string

  beforeAll(async () => {
    const users = await _getUsers()
    const questions = await _getQuestions()
    userId = Object.values(users)[0].id
    questionId = Object.values(questions)[0].id
  })

  describe("success", () => {
    test.each(["optionOne", "optionTwo"])(
      "answerId is '%s'",
      async (answerId) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userId,
            qid: questionId,
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
              qid: questionId,
              answerId: "optionOne",
            }),
          ).rejects.toEqual("Please provide authedUser, qid, and answer")
        },
      )

      test.each(["", null, undefined])("qid is '%s'", async (qid) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userId,
            qid,
            answerId: "optionOne",
          }),
        ).rejects.toEqual("Please provide authedUser, qid, and answer")
      })

      test.each(["", null, undefined])("answerId is '%s'", async (answerId) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userId,
            qid: questionId,
            answerId: answerId as AnswerId,
          }),
        ).rejects.toEqual("Please provide authedUser, qid, and answer")
      })
    })

    describe("valid arguments but do not exist", () => {
      it("answerId should be optionOne or optionTwo", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userId,
            qid: questionId,
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
            qid: questionId,
            answerId: "optionOne",
          }),
        ).rejects.toBe("User id '123' does not exist")
      })

      it("question id should exist in database", async () => {
        await expect(
          _saveQuestionAnswer({
            authedUser: userId,
            qid: "123",
            answerId: "optionThree" as AnswerId,
          }),
        ).rejects.toBe("Question id '123' does not exist")
      })
    })
  })
})
