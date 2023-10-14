import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import { getQuestions } from "../../api"
import type { RootState } from "../../app/store"
import type { AnswerId, Question, QuestionId, UserId } from "../../interfaces"

const questionsAdapter = createEntityAdapter<Question>({
  sortComparer: (a, b) => b.timestamp - a.timestamp,
})

const initialState = questionsAdapter.getInitialState()

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async () => {
    const response = await getQuestions()
    return response
  },
)

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    addAnswer: (
      state,
      action: PayloadAction<{
        userId: UserId
        questionId: QuestionId
        answerId: AnswerId
      }>,
    ) => {
      const { userId, questionId, answerId } = action.payload
      const question = state.entities[questionId]
      if (question) {
        question[answerId].votes.push(userId)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.fulfilled, questionsAdapter.setAll)
  },
})

export const { addAnswer: addQuestionAnswer } = questionsSlice.actions

export const {
  selectAll: selectAllQuestions,
  selectById: selectQuestionById,
  selectIds: selectQuestionIds,
} = questionsAdapter.getSelectors<RootState>((state) => state.questions)

export default questionsSlice.reducer
