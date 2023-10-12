import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { store } from "./app/store"
import { fetchQuestions } from "./features/questions/questionsSlice"
import { fetchUsers } from "./features/users/usersSlice"
import "./index.css"
import { routesConfig } from "./routes"

const router = createBrowserRouter(routesConfig)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const start = async () => {
  await store.dispatch(fetchUsers())
  await store.dispatch(fetchQuestions())

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>,
  )
}

start()
