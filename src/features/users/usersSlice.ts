import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { getUsers, saveUser } from "../../api"
import type { RootState } from "../../app/store"
import { QuestionAlreadyExist, UserNotFoundError } from "../../errors"
import type { AnswerId, QuestionId, User, UserId } from "../../interfaces"

const usersAdapter = createEntityAdapter<User>()
const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await getUsers()
  return response
})

interface RegisteringUser {
  id: string
  name: string
  password: string
  avatarURL?: string
}

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user: RegisteringUser) => {
    const result = await saveUser(user)
    return result
  },
)

const usersSlice = createSlice({
  name: "users",
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
      const user = state.entities[userId]
      if (!user) {
        throw new UserNotFoundError(userId)
      }
      user.answers[questionId] = answerId
      return state
    },
    addQuestion: (
      state,
      action: PayloadAction<{ userId: UserId; questionId: QuestionId }>,
    ) => {
      const { userId, questionId } = action.payload
      const user = state.entities[userId]
      if (!user) {
        throw new UserNotFoundError(userId)
      }
      if (user.questions.includes(questionId)) {
        throw new QuestionAlreadyExist(questionId)
      }
      user.questions.push(questionId)
      return state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, usersAdapter.setAll)
      .addCase(addUser.fulfilled, usersAdapter.addOne)
  },
})

export const { addAnswer: addUserAnswer, addQuestion: addQuestionToUser } =
  usersSlice.actions

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors<RootState>((state) => state.users)

export const selectUsersSortedByScore = createSelector(
  [selectAllUsers],
  (users): User[] =>
    users.slice().sort((lhs, rhs) => {
      const lhsScore = Object.keys(lhs.answers).length + lhs.questions.length
      const rhsScore = Object.keys(rhs.answers).length + rhs.questions.length
      return rhsScore - lhsScore
    }),
)
export default usersSlice.reducer
