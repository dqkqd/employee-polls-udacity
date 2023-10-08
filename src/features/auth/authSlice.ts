import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { AuthedUser } from "../../interfaces";
import { selectUserById } from "../users/usersSlice";

interface ValidatingUser {
  id: string;
  password: string;
}

const initialState: AuthedUser = {
  id: null,
  name: null,
  password: null,
};

export const validateUser = createAsyncThunk(
  "auth/validate",
  async ({ id, password }: ValidatingUser, { getState }) => {
    const state = getState();
    const user = selectUserById(state as RootState, id);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(validateUser.fulfilled, (state, action) => {
      if (action.payload) {
        return action.payload;
      }
    });
  },
});

export const selectAuthedUser = (state: RootState) => state.auth;

export default authSlice.reducer;
