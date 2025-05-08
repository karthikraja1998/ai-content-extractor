import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // More advanced user interaction
import Input from "../Input"; // Adjust the path if needed
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast styles

// Mock the toast.error function.  This is crucial for testing the error message.
jest.mock("react-toastify", () => {
  const actual = jest.requireActual("react-toastify"); // import other parts of react-toastify
  return {
    ...actual,
    toast: {
      ...actual.toast,
      error: jest.fn(), // Mock the error function
    },
    ToastContainer: ({ children }: any) => <div>{children}</div>, // simplified ToastContainer
  };
});

// Helper function to wrap the component and handle ToastContainer
const renderWithToast = (ui: React.ReactElement) => {
  return render(
    <>
      {ui}
      <div id="toast-root"></div> {/* Important:  Create a root for toasts */}
    </>,
  );
};

describe("Input Component", () => {
  it("should render without crashing", () => {
    const onSubmit = jest.fn();
    renderWithToast(<Input onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText("Enter the URL...")).toBeInTheDocument();
  });

  it("should update the input value when typing", async () => {
    const onSubmit = jest.fn();
    renderWithToast(<Input onSubmit={onSubmit} />);
    const inputElement = screen.getByPlaceholderText(
      "Enter the URL...",
    ) as HTMLInputElement;

    await userEvent.type(inputElement, "https://example.com");
    expect(inputElement.value).toBe("https://example.com");
  });

  it("should call onSubmit with the URL when the form is submitted", async () => {
    const onSubmit = jest.fn();
    renderWithToast(<Input onSubmit={onSubmit} />);
    const inputElement = screen.getByPlaceholderText("Enter the URL...");
    const submitButton = screen.getByRole("button");

    await userEvent.type(inputElement, "https://example.com");
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("https://example.com");
  });

  it("should display an error toast when submitting an empty URL", async () => {
    const onSubmit = jest.fn();
    renderWithToast(<Input onSubmit={onSubmit} />);
    const submitButton = screen.getByRole("button");

    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("Enter the URL before searching");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should display the placeholder text", () => {
    const onSubmit = jest.fn();
    renderWithToast(<Input onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText("Enter the URL...")).toBeInTheDocument();
  });
});
