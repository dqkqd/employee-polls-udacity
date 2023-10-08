import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import React, { type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import authSlice from "../features/auth/authSlice";
import usersSlice from "../features/users/usersSlice";

// As a basic setup, import your same slice reducers

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        auth: authSlice,
        users: usersSlice,
      },
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
