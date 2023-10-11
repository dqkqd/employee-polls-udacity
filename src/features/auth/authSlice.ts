import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUsers, saveUser } from "../../api"
import type { RootState } from "../../app/store"
import type { AuthedUser } from "../../interfaces"

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
  password: null,
  status: "idle",
}

export const validateUser = createAsyncThunk(
  "auth/validate",
  async ({ id, password }: ValidatingUser, { getState }) => {
    // TODO(khanhdq): write a method to get user by id
    const users = await getUsers()
    if (!Object.hasOwn(users, id) || users[id].password !== password) {
      throw new Error("Invalid user or password")
    }
    return users[id]
  },
)

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (user: RegisteringUser) => {
    const result = await saveUser(user)
    return result
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
        const { id, name, password } = action.payload
        return { id, name, password, status: "success" }
      })
      .addCase(validateUser.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        // TODO(khanhdq) add user to store
        const { id, name, password } = action.payload
        return { id, name, password, status: "success" }
      })
      .addCase(signupUser.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const selectAuthedUser = (state: RootState) => state.auth

export default authSlice.reducer
