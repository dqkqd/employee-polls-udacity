import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { getUsers, saveUser } from "../../api"
import type { RootState } from "../../app/store"
import type { PublicUser, User } from "../../interfaces"

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, usersAdapter.setAll)
      .addCase(addUser.fulfilled, usersAdapter.addOne)
  },
})

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors<RootState>((state) => state.users)

export const selectAllPublicUsers = createSelector(
  [selectAllUsers],
  (users): PublicUser[] =>
    users.map((user) => ({
      id: user.id,
      name: user.name,
      avatarURL: user.avatarURL,
    })),
)
export default usersSlice.reducer
