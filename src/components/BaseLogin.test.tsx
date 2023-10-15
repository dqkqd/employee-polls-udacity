import { render, screen } from "@testing-library/react"
import BaseAuthPage from "./BaseLogin"

describe("Test Base Auth Page", () => {
  it("Render", () => {
    render(
      <BaseAuthPage>
        <div>Basic Auth Page</div>
      </BaseAuthPage>,
    )

    expect(screen.getByText("Employee Polls")).toBeInTheDocument()
    expect(screen.getByText("Basic Auth Page")).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/src/login-logo.jpg",
    )
  })
})
