import { createAsyncThunk } from "@reduxjs/toolkit"
import { saveQuestionAnswer } from "../../api"
import { AnswerId, QuestionId, UserId } from "../../interfaces"
import { addQuestionAnswer } from "../questions/questionsSlice"
import { addUserAnswer } from "../users/usersSlice"

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
