import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUser } from "../../api"
import type { RootState } from "../../app/store"
import type { AuthedUser } from "../../interfaces"
import { addUser } from "../users/usersSlice"

interface ValidatingUser {
  id: string
  password: string
}

interface RegisteringUser {
  id: string
  name: string
  password: string
  avatarURL?: string
}

const initialState: AuthedUser = {
  id: null,
  name: null,
  avatarURL: null,
  password: null,
  status: "idle",
}

export const validateUser = createAsyncThunk(
  "auth/validate",
  async ({ id, password }: ValidatingUser, { getState }) => {
    const user = await getUser(id)
    if (!user || user.password !== password) {
      throw new Error("Invalid user or password")
    }
    return user
  },
)

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (user: RegisteringUser, { dispatch }) => {
    const result = await dispatch(addUser(user)).unwrap()
    return result
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(validateUser.fulfilled, (state, action) => {
        const { id, name, password, avatarURL } = action.payload
        return { id, name, password, avatarURL, status: "success" }
      })
      .addCase(validateUser.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        const { id, name, password, avatarURL } = action.payload
        return { id, name, password, avatarURL, status: "success" }
      })
      .addCase(signupUser.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const { logoutUser } = authSlice.actions
export const selectAuthedUser = (state: RootState) => state.auth

export default authSlice.reducer
