import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import type { AuthedUser } from "../../interfaces"
import { selectUserById } from "../users/usersSlice"

interface ValidatingUser {
  id: string
  password: string
}

const initialState: AuthedUser = {
  id: null,
  name: null,
  password: null,
  status: "idle",
}

export const validateUser = createAsyncThunk(
  "auth/validate",
  async ({ id, password }: ValidatingUser, { getState }) => {
    const state = getState()
    const user = selectUserById(state as RootState, id)
    if (user && user.password === password) {
      return user
    }
    return undefined
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(validateUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(validateUser.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, name, password } = action.payload
          return { id, name, password, status: "success" }
        } else {
          state.status = "failed"
        }
      })
      .addCase(validateUser.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const selectAuthedUser = (state: RootState) => state.auth

export default authSlice.reducer
