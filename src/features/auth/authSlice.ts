import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { AuthedUser } from "../../interfaces";

const initialState: AuthedUser = {
  id: null,
  name: null,
  password: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const selectAuthedUser = (state: RootState) => state.auth;

export default authSlice.reducer;
