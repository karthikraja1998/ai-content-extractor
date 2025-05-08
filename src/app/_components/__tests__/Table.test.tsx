import React from "react";
import { render, screen } from "@testing-library/react";
import Summary from "../Table"; // Adjust the import path as necessary

const mockData = [
  {
    id: 1,
    url: "https://example.com/article1",
    summary: "This is a summary of article 1.",
    keyPoints: '["Point 1A", "Point 1B"]',
    createdAt: new Date("2025-05-07T10:00:00.000Z"),
  },
  {
    id: 2,
    url: "https://example.com/article2",
    summary: "Summary of the second article.",
    keyPoints: '["Key Point 2.1", "Key Point 2.2", "Key Point 2.3"]',
    createdAt: new Date("2025-05-06T15:30:00.000Z"),
  },
];

describe("<Summary />", () => {
  it("renders the table headers", () => {
    render(<Summary data={mockData} />);
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Key Points")).toBeInTheDocument();
    expect(screen.getByText("Created At")).toBeInTheDocument();
  });

  it("renders the table rows with data", () => {
    render(<Summary data={mockData} />);
    expect(
      screen.getByText("https://example.com/article1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This is a summary of article 1."),
    ).toBeInTheDocument();
    expect(screen.getByText("Point 1A")).toBeInTheDocument();
    expect(screen.getByText("Point 1B")).toBeInTheDocument();
    // Use a function to match the date, as the format may vary
    expect(
      screen.getByText((content) => {
        const date = new Date("2025-05-07T10:00:00.000Z").toLocaleDateString();
        return content === date;
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("https://example.com/article2"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Summary of the second article."),
    ).toBeInTheDocument();
    expect(screen.getByText("Key Point 2.1")).toBeInTheDocument();
    expect(screen.getByText("Key Point 2.2")).toBeInTheDocument();
    expect(screen.getByText("Key Point 2.3")).toBeInTheDocument();
    // Use a function to match the date
    expect(
      screen.getByText((content) => {
        const date = new Date("2025-05-06T15:30:00.000Z").toLocaleDateString();
        return content === date;
      }),
    ).toBeInTheDocument();
  });

  it("renders URLs as clickable links", () => {
    render(<Summary data={mockData} />);
    const linkElement = screen.getByRole("link", {
      name: "https://example.com/article1",
    });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://example.com/article1");
    expect(linkElement).toHaveAttribute("target", "_blank");
  });

  it("renders key points as a bulleted list", () => {
    render(<Summary data={mockData} />);
    const keyPointsList = screen.getAllByRole("list")[0]; //gets the first list.
    expect(keyPointsList).toBeInTheDocument();
    expect(screen.getByText("Point 1A")).toBeInTheDocument();
    expect(screen.getByText("Point 1B")).toBeInTheDocument();
  });
});
