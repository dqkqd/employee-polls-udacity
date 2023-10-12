import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import { getQuestions } from "../../api"
import type { RootState } from "../../app/store"
import type { Question } from "../../interfaces"

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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.fulfilled, questionsAdapter.setAll)
  },
})

export const {
  selectAll: selectAllQuestions,
  selectById: selectQuestionById,
  selectIds: selectQuestionIds,
} = questionsAdapter.getSelectors<RootState>((state) => state.questions)

export default questionsSlice.reducer
