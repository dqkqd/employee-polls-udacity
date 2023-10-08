import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import { fetchUsers } from "./features/users/usersSlice";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { routesConfig } from "./routes";

const router = createBrowserRouter(routesConfig);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const start = async () => {
  await store.dispatch(fetchUsers());

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
};

start();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
