import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../../App";
import { api } from "~/trpc/react";
import userEvent from "@testing-library/user-event";
jest.mock("~/trpc/react", () => ({
  api: {
    post: {
      getAllSummaries: {
        useQuery: jest.fn(),
      },
      getSummary: {
        useMutation: jest.fn(),
      },
    },
  },
}));

jest.mock("../../_components/Input", () => (props: any) => (
  <button onClick={() => props.onSubmit("https://test.com")}>Submit</button>
));
jest.mock("../../_components/Header", () => () => <div>Header</div>);
jest.mock("../../_components/Table", () => (props: any) => (
  <div>Summary Table: {props.data.length}</div>
));
jest.mock("../../_components/Loader", () => () => <div>Loading...</div>);

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Header and Input", () => {
    (api.post.getAllSummaries.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    render(<App />);
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("shows loader when loading", () => {
    (api.post.getAllSummaries.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders summary table when data is present", () => {
    (api.post.getAllSummaries.useQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          url: "https://test.com",
          summary: "summary",
          keyPoints: "points",
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isError: false,
    });
    render(<App />);
    expect(screen.getByText(/Summary Table: 1/)).toBeInTheDocument();
  });

  it("calls postSummary and updates summaryData on submit", async () => {
    (api.post.getAllSummaries.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    const mutateAsync = jest.fn().mockResolvedValue([
      {
        id: 2,
        url: "https://test.com",
        summary: "summary2",
        keyPoints: "points2",
        createdAt: new Date().toISOString(),
      },
    ]);
    (api.post.getSummary.useMutation as jest.Mock).mockReturnValue({
      mutateAsync,
    });
    render(<App />);
    userEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(screen.getByText(/Summary Table: 1/)).toBeInTheDocument(),
    );
    expect(mutateAsync).toHaveBeenCalledWith({ URL: "https://test.com" });
  });
});
