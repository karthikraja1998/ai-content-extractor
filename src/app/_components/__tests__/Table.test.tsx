import React from "react";
import { render, screen } from "@testing-library/react";
import Summary from "../Table"; // Adjust the import path as necessary

describe("Summary Component", () => {
  const mockData = [
    {
      id: 1,
      url: "https://example.com",
      summary: "This is a summary",
      keyPoints: JSON.stringify(["Point 1", "Point 2"]),
      createdAt: new Date(),
    },
    {
      id: 2,
      url: "https://example2.com",
      summary: "Another summary",
      keyPoints: JSON.stringify(["Point A", "Point B"]),
      createdAt: new Date(),
    },
  ];

  it("renders the table headers correctly", () => {
    render(<Summary data={mockData} />);
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Key Points")).toBeInTheDocument();
    expect(screen.getByText("Created At")).toBeInTheDocument();
  });

  it("renders the data rows correctly", () => {
    render(<Summary data={mockData} />);
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("This is a summary")).toBeInTheDocument();
    expect(screen.getByText("Point 1")).toBeInTheDocument();
    expect(screen.getByText("Point 2")).toBeInTheDocument();

    // Use getAllByText to handle multiple matching elements
    const createdAtElements = screen.getAllByText(
      new Date(mockData[0]!.createdAt).toLocaleDateString(),
    );
    expect(createdAtElements).toHaveLength(2); // Ensure there are two matching elements

    // Optionally, verify specific rows if needed
    expect(createdAtElements[0]).toBeInTheDocument();
    expect(createdAtElements[1]).toBeInTheDocument();
  });

  it("renders key points as a list", () => {
    render(<Summary data={mockData} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4); // 2 key points for each row
    expect(listItems[0]).toHaveTextContent("Point 1");
    expect(listItems[1]).toHaveTextContent("Point 2");
  });

  it("renders a message when no data is provided", () => {
    render(<Summary data={[]} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
