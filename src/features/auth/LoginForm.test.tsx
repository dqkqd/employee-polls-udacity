import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "../../utils/test-utils";
import LoginForm from "./LoginForm";

describe("Test login form", () => {
  it("Render", () => {
    renderWithProviders(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Employee ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  describe("Input", () => {
    it("Write to form should change text", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      const inputId = screen.getByLabelText("Employee ID");
      expect(inputId).toHaveDisplayValue("");
      await act(async () => {
        await user.type(inputId, "@fake-user-id");
      });
      expect(inputId).toHaveDisplayValue("@fake-user-id");

      const password = screen.getByLabelText("Password");
      expect(password).toHaveDisplayValue("");
      await act(async () => {
        await user.type(password, "@fake-password");
      });
      expect(password).toHaveDisplayValue("@fake-password");
    });

    it("Toggle should show / hide password", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      const password = screen.getByLabelText("Password");
      await act(async () => {
        await user.type(password, "@fake-password");
      });
      expect(password).toHaveAttribute("type", "password");

      const toggleButton = within(screen.getByTestId("login-form-input-password")).getByRole(
        "button"
      );
      await act(async () => {
        await user.click(toggleButton);
      });
      expect(password).toHaveAttribute("type", "text");

      await act(async () => {
        await user.click(toggleButton);
      });
      expect(password).toHaveAttribute("type", "password");
    });
  });

  describe("Button", () => {
    it("Button is disabled until inputs are not empty", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );

      expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled();

      const inputId = screen.getByLabelText("Employee ID");
      await act(async () => {
        await user.type(inputId, "@fake-user-id");
      });
      expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled();

      const password = screen.getByLabelText("Password");
      await act(async () => {
        await user.type(password, "@fake-password");
      });

      expect(screen.getByRole("button", { name: "Log In" })).toBeEnabled();
    });
  });
});
