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
  ) => {
    const { userId, questionId, answerId } = option

    const response = await saveQuestionAnswer({
      authedUser: userId,
      qid: questionId,
      answerId,
    })

    if (response) {
      dispatch(addQuestionAnswer({ userId, questionId, answerId }))
      dispatch(addUserAnswer({ userId, questionId, answerId }))
    }

    return response
  },
)
