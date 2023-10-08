import type { PreloadedState } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import type { AppStore, RootState } from "../app/store";
import authSlice from "../features/auth/authSlice";
import usersSlice from "../features/users/usersSlice";

// As a basic setup, import your same slice reducers
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  route?: string;
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = "/",
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        auth: authSlice,
        users: usersSlice,
      },
      preloadedState,
    }),

    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  window.history.pushState({}, "Test page", route);

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
