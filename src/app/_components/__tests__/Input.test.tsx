import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // More advanced user interaction
import Input from "../Input"; // Adjust the path if needed
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast styles

describe("Input Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input field and button", () => {
    render(<Input onSubmit={mockOnSubmit} />);
    expect(screen.getByPlaceholderText("Enter the URL...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("updates the input value when typing", async () => {
    render(<Input onSubmit={jest.fn()} />);
    const input = screen.getByPlaceholderText("Enter the URL...");
    await userEvent.type(input, "https://example.com");
    expect(input).toHaveValue("https://example.com");
  });

  it("calls onSubmit with the correct URL when a valid URL is entered", async () => {
    render(<Input onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText("Enter the URL...");
    const form = screen.getByRole("form"); // Now this will work

    await userEvent.type(input, "https://example.com");
    fireEvent.submit(form); // Simulate form submission

    expect(mockOnSubmit).toHaveBeenCalledWith("https://example.com");
  });

  it("does not show an error toast when a valid URL is submitted", async () => {
    render(<Input onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText("Enter the URL...");
    const button = screen.getByRole("button");

    userEvent.type(input, "https://example.com");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.queryByText("Enter the URL before searching"),
      ).not.toBeInTheDocument();
    });
  });
});
