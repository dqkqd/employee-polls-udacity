import { createAsyncThunk } from "@reduxjs/toolkit"
import { saveQuestion, saveQuestionAnswer } from "../../api"
import { AnswerId, QuestionId, UserId } from "../../interfaces"
import { addQuestion, addQuestionAnswer } from "../questions/questionsSlice"
import { addQuestionToUser, addUserAnswer } from "../users/usersSlice"

export const pickAnswer = createAsyncThunk(
  "pickAnswer",
  async (
    option: { userId: UserId; questionId: QuestionId; answerId: AnswerId },
    { dispatch },
  ): Promise<{ ok: boolean; error?: string }> => {
    const { userId, questionId, answerId } = option

    try {
      await saveQuestionAnswer({
        authedUser: userId,
        qid: questionId,
        answerId,
      })
      dispatch(addQuestionAnswer({ userId, questionId, answerId }))
      dispatch(addUserAnswer({ userId, questionId, answerId }))
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e as string }
    }
  },
)

export const createNewQuestion = createAsyncThunk(
  "addQuestion",
  async (
    option: { optionOneText: string; optionTwoText: string; author: UserId },
    { dispatch },
  ) => {
    try {
      const question = await saveQuestion(option)
      dispatch(
        addQuestionToUser({ userId: option.author, questionId: question.id }),
      )
      dispatch(addQuestion(question))
      return { ok: true, qid: question.id }
    } catch (e) {
      return { ok: false, error: e as string }
    }
  },
)
