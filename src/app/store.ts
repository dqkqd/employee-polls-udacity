import {
  combineReducers,
  configureStore,
  type Action,
  type PreloadedState,
  type ThunkAction,
} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import questionsReducer from "../features/questions/questionsSlice"
import usersReducer from "../features/users/usersSlice"

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  questions: questionsReducer,
})

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      questions: questionsReducer,
    },
    preloadedState,
  })
}
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    questions: questionsReducer,
  },
})

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
