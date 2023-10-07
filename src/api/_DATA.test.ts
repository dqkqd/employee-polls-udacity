import type { QuestionsDictionary, UsersDictionary } from "../interfaces";
import type { AnswerId } from "./../interfaces/index";
import { _getQuestions, _getUsers, _saveQuestion, _saveQuestionAnswer } from "./_DATA";

describe("Test save questions", () => {
  it("success", async () => {
    await expect(
      _saveQuestion({
        optionOneText: "option1",
        optionTwoText: "option2",
        author: "author1",
      })
    ).resolves.toMatchObject({
      author: "author1",
      optionOne: { votes: [], text: "option1" },
      optionTwo: { votes: [], text: "option2" },
    });
  });

  describe("empty, null or undefined arguments", () => {
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
          })
        ).rejects.toEqual("Please provide optionOneText, optionTwoText, and author");
      }
    );
  });
});

describe("Test save question's answers", () => {
  let users: UsersDictionary;
  let questions: QuestionsDictionary;

  beforeAll(async () => {
    users = await _getUsers();
    questions = await _getQuestions();
  });

  describe("success", () => {
    test.each(["optionOne", "optionTwo"])("answerId is '%s'", async (answerId) => {
      await expect(
        _saveQuestionAnswer({
          authedUser: Object.values(users)[0].id,
          qid: Object.values(questions)[0].id,
          answerId: answerId as AnswerId,
        })
      ).resolves.toBe(true);
    });
  });

  describe("failed", () => {
    describe("arguments should not be empty, null or undefined", () => {
      test.each(["", null, undefined])("authedUser is '%s'", async (authedUser) => {
        await expect(
          _saveQuestionAnswer({
            authedUser,
            qid: Object.values(questions)[0].id,
            answerId: "optionOne",
          })
        ).rejects.toEqual("Please provide authedUser, qid, and answer");
      });

      test.each(["", null, undefined])("qid is '%s'", async (qid) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid,
            answerId: "optionOne",
          })
        ).rejects.toEqual("Please provide authedUser, qid, and answer");
      });

      test.each(["", null, undefined])("answerId is '%s'", async (answerId) => {
        await expect(
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid: Object.values(questions)[0].id,
            answerId: answerId as AnswerId,
          })
        ).rejects.toEqual("Please provide authedUser, qid, and answer");
      });
    });

    describe("valid arguments but do not exist", () => {
      it("answerId should be optionOne or optionTwo", async () => {
        jest.useFakeTimers();
        expect.assertions(1);

        try {
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid: Object.values(questions)[0].id,
            answerId: "optionThree" as AnswerId,
          });

          jest.runAllTimers();
        } catch (err) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(err).toBeInstanceOf(TypeError);
        }
      });

      it("user should exist in database", () => {
        jest.useFakeTimers();
        expect.assertions(1);

        try {
          _saveQuestionAnswer({
            authedUser: "123",
            qid: Object.values(questions)[0].id,
            answerId: "optionThree" as AnswerId,
          });

          jest.runAllTimers();
        } catch (err) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(err).toBeInstanceOf(TypeError);
        }
      });

      it("question id should exist in database", () => {
        jest.useFakeTimers();
        expect.assertions(1);

        try {
          _saveQuestionAnswer({
            authedUser: Object.values(users)[0].id,
            qid: "123",
            answerId: "optionThree" as AnswerId,
          });

          jest.runAllTimers();
        } catch (err) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(err).toBeInstanceOf(TypeError);
        }
      });
    });
  });
});
