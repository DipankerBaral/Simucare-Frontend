import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HeartbeatMonitor from "./HeartbeatMonitor";

// Mock the useNavigate function from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("HeartbeatMonitor component", () => {
  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <HeartbeatMonitor />
      </MemoryRouter>
    );
  });

  it("allows editing a value on double-click", () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <HeartbeatMonitor />
      </MemoryRouter>
    );

    // Find a value element (e.g., BPM value) and simulate a double-click event
    const bpmValueElement = getByText("BPM: 75");
    fireEvent.doubleClick(bpmValueElement);

    // Find the input field that should appear for editing
    const inputField = getByPlaceholderText("Enter a new value");

    // Check if the input field is present after double-clicking
    expect(inputField).toBeInTheDocument();
  });
});
