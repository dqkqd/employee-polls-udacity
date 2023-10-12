import type { PreloadedState } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { render, type RenderOptions } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { Provider } from "react-redux"
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import type { AppStore, RootState } from "../app/store"
import authSlice from "../features/auth/authSlice"
import questionReducer from "../features/questions/questionsSlice"
import usersSlice from "../features/users/usersSlice"
import { routesConfig } from "../routes"
import { initialUsers } from "./test-data"

// As a basic setup, import your same slice reducers
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  route?: string
  router?: ReturnType<typeof createMemoryRouter>
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = "/",
    preloadedState = {
      users: initialUsers,
    },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        auth: authSlice,
        users: usersSlice,
        questions: questionReducer,
      },
      preloadedState,
    }),
    router = createMemoryRouter(routesConfig, {
      initialEntries: [route],
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper(): JSX.Element {
    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )
  }

  window.history.pushState({}, "Test page", route)

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export function renderDefault({
  route = "/",
  preloadedState = {
    users: initialUsers,
  },
  // Automatically create a store instance if no store was passed in
  store = configureStore({
    reducer: {
      auth: authSlice,
      users: usersSlice,
      questions: questionReducer,
    },
    preloadedState,
  }),
  router = createMemoryRouter(routesConfig, {
    initialEntries: [route],
  }),
  ...renderOptions
}: ExtendedRenderOptions = {}) {
  return renderWithProviders(<></>, {
    route,
    preloadedState,
    store,
    router,
    ...renderOptions,
  })
}
