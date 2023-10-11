import { act, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { getUsers } from "../../api"
import { renderDefault } from "../../utils/test-utils"

describe("Test signup page", () => {
  it("Render", () => {
    renderDefault({ route: "/signup" })

    expect(screen.getByLabelText("sign-up-page-title")).toHaveTextContent(
      "Sign Up",
    )
    expect(screen.getByLabelText("Employee ID")).toBeInTheDocument()
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Avatar URL")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Re-enter password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument()
  })

  describe("Input", () => {
    it("Write to form should change text", async () => {
      const { user } = renderDefault({ route: "/signup" })

      const idEle = screen.getByLabelText("Employee ID")
      expect(idEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(idEle, "@new-user-id")
      })
      expect(idEle).toHaveDisplayValue("@new-user-id")

      const nameEle = screen.getByLabelText("Name")
      expect(nameEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(nameEle, "@new-user-name")
      })
      expect(nameEle).toHaveDisplayValue("@new-user-name")

      const avatarEle = screen.getByLabelText("Avatar URL")
      expect(avatarEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(avatarEle, "@new-user-avatar")
      })
      expect(avatarEle).toHaveDisplayValue("@new-user-avatar")

      const passwordEle = screen.getByLabelText("Password", {
        selector: "input",
      })
      expect(passwordEle).toHaveDisplayValue("")
      await act(async () => {
        await user.type(passwordEle, "@new-password")
      })
      expect(passwordEle).toHaveDisplayValue("@new-password")

      const repeatPasswordEle = screen.getByLabelText("Re-enter password", {
        selector: "input",
      })
      await act(async () => {
        await user.type(repeatPasswordEle, "@new-password")
      })
      expect(repeatPasswordEle).toHaveDisplayValue("@new-password")
    })

    it("Show error when password mismatch", async () => {
      const { user } = renderDefault({ route: "/signup" })

      const passwordEle = screen.getByLabelText("Password", {
        selector: "input",
      })
      const repeatPasswordEle = screen.getByLabelText("Re-enter password", {
        selector: "input",
      })

      await act(async () => {
        await user.type(passwordEle, "@new-password")
        await user.type(repeatPasswordEle, "@new-password2")
      })
      expect(screen.getByText("Password did not match")).toBeInTheDocument()

      await act(async () => {
        await user.clear(repeatPasswordEle)
        await user.type(repeatPasswordEle, "@new-password")
      })
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()
    })

    it("Do not show error when password field is empty", async () => {
      const { user } = renderDefault({ route: "/signup" })

      const passwordEle = screen.getByLabelText("Password", {
        selector: "input",
      })
      const repeatPasswordEle = screen.getByLabelText("Re-enter password", {
        selector: "input",
      })

      // password and repeatPassword is empty
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()

      // password is not empty, repeatPassword is empty
      await act(async () => {
        await user.type(passwordEle, "@new-password")
      })
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()

      // password is empty, repeatPassword is not empty
      await act(async () => {
        await user.clear(passwordEle)
        await user.type(repeatPasswordEle, "@new-password")
      })
      expect(
        screen.queryByText("Password did not match"),
      ).not.toBeInTheDocument()
    })
  })

  describe("Button", () => {
    it("Should be disabled when one of the input is empty", async () => {
      const { user } = renderDefault({ route: "/signup" })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      const inputEle = screen.getByLabelText("Employee ID")
      const nameEle = screen.getByLabelText("Name")
      const passwordEle = screen.getByLabelText("Password")
      const repeatPasswordEle = screen.getByLabelText("Re-enter password")

      await act(async () => {
        await user.type(inputEle, "123")
        await user.type(nameEle, "123")
        await user.type(passwordEle, "123")
        await user.type(repeatPasswordEle, "123")
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeEnabled()

      await act(async () => {
        await user.clear(inputEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      await act(async () => {
        await user.type(inputEle, "123")
        await user.clear(nameEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      await act(async () => {
        await user.type(nameEle, "123")
        await user.clear(passwordEle)
        await user.clear(repeatPasswordEle)
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()
    })

    it("Should be disabled when password mismatch", async () => {
      const { user } = renderDefault({ route: "/signup" })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      const inputEle = screen.getByLabelText("Employee ID")
      const nameEle = screen.getByLabelText("Name")
      const passwordEle = screen.getByLabelText("Password")
      const repeatPasswordEle = screen.getByLabelText("Re-enter password")

      await act(async () => {
        await user.type(inputEle, "123")
        await user.type(nameEle, "123")
        await user.type(passwordEle, "password123")
        await user.type(repeatPasswordEle, "password")
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled()

      await act(async () => {
        await user.clear(repeatPasswordEle)
        await user.type(repeatPasswordEle, "password123")
      })
      expect(screen.getByRole("button", { name: "Sign up" })).toBeEnabled()
    })
  })

  describe("Signup", () => {
    it("Successfully signup user", async () => {
      const { store, user } = renderDefault({ route: "/signup" })

      const inputEle = screen.getByLabelText("Employee ID")
      const nameEle = screen.getByLabelText("Name")
      const passwordEle = screen.getByLabelText("Password")
      const repeatPasswordEle = screen.getByLabelText("Re-enter password")
      const button = screen.getByRole("button", { name: "Sign up" })

      const newUser = {
        id: "123456",
        name: "John Wick",
        password: "password123",
      }

      await act(async () => {
        await user.type(inputEle, newUser.id)
        await user.type(nameEle, newUser.name)
        await user.type(passwordEle, newUser.password)
        await user.type(repeatPasswordEle, newUser.password)
        await user.click(button)
      })

      // signing up user, everything should be disabled
      expect(screen.getByTestId("signup-loading")).toBeInTheDocument()
      expect(inputEle).toBeDisabled()
      expect(nameEle).toBeDisabled()
      expect(passwordEle).toBeDisabled()
      expect(repeatPasswordEle).toBeDisabled()
      expect(button).toBeDisabled()

      // should moved into home page now
      await waitFor(() => {
        expect(screen.getByText(`Hello ${newUser.name}`)).toBeInTheDocument()
      })

      const { auth, users } = store.getState()

      // auth should be registered
      expect(auth).toMatchObject(newUser)

      // user should be added to store
      // eslint-disable-next-line jest/valid-expect
      expect(users.ids).to.be.includes(newUser.id)
      expect(users.entities[newUser.id]).toMatchObject(newUser)

      // user should existed in database as well
      const usersFromDatabase = await getUsers()
      expect(usersFromDatabase[newUser.id]).toMatchObject(newUser)
    })

    it("Cannot signup when user id existed", async () => {
      const users = await getUsers()
      const userId = Object.values(users)[0].id

      const { user } = renderDefault({ route: "/signup" })

      const inputEle = screen.getByLabelText("Employee ID")
      const nameEle = screen.getByLabelText("Name")
      const passwordEle = screen.getByLabelText("Password")
      const repeatPasswordEle = screen.getByLabelText("Re-enter password")
      const button = screen.getByRole("button", { name: "Sign up" })

      await act(async () => {
        await user.type(inputEle, userId)
        await user.type(nameEle, "123")
        await user.type(passwordEle, "password123")
        await user.type(repeatPasswordEle, "password123")
        await user.click(button)
      })

      await waitFor(() => {
        expect(
          screen.getByText("Please use different employee id"),
        ).toBeInTheDocument()
      })
    })
  })
})
