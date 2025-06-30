import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WorkbenchLayout } from "../workbench-layout";

// Mock the zustand store
jest.mock("@/store/workbench-store", () => ({
  useWorkbenchStore: () => ({
    systemLogs: [],
    addSystemLog: jest.fn(),
  }),
}));

describe("WorkbenchLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders workbench layout with all required elements", () => {
    render(<WorkbenchLayout />);

    // Check header
    expect(screen.getByText("Digital Workbench")).toBeInTheDocument();
    expect(
      screen.getByText("Multi-Agent Collaboration Platform")
    ).toBeInTheDocument();

    // Check user input section
    expect(screen.getByText("Initiate Request")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your request or task description...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

    // Check system event log
    expect(screen.getByText("System Event Log")).toBeInTheDocument();
  });

  test("renders all three agent areas", () => {
    render(<WorkbenchLayout />);

    expect(screen.getByText("PM Agent")).toBeInTheDocument();
    expect(
      screen.getByText("Project Management & Coordination")
    ).toBeInTheDocument();

    expect(screen.getByText("Analyst Agent")).toBeInTheDocument();
    expect(
      screen.getByText("Data Analysis & Requirements")
    ).toBeInTheDocument();

    expect(screen.getByText("Design Agent")).toBeInTheDocument();
    expect(screen.getByText("UI/UX Design & Prototyping")).toBeInTheDocument();
  });

  test("input field and submit button work correctly", () => {
    render(<WorkbenchLayout />);

    const input = screen.getByPlaceholderText(
      "Enter your request or task description..."
    );
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Initially submit button should be disabled
    expect(submitButton).toBeDisabled();

    // Type in input
    fireEvent.change(input, { target: { value: "Test request" } });
    expect(input).toHaveValue("Test request");

    // Submit button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Submit form
    fireEvent.click(submitButton);

    // Input should be cleared after submit
    expect(input).toHaveValue("");
  });

  test("shows empty state for system logs when no logs exist", () => {
    render(<WorkbenchLayout />);

    expect(
      screen.getByText("No system events yet. Submit a request to begin.")
    ).toBeInTheDocument();
  });

  test("all agent areas show idle status", () => {
    render(<WorkbenchLayout />);

    const idleStatuses = screen.getAllByText("idle");
    expect(idleStatuses).toHaveLength(3); // One for each agent
  });

  test("responsive layout has proper classes", () => {
    render(<WorkbenchLayout />);

    // Check for responsive grid classes
    const agentGrid = screen.getByText("PM Agent").closest(".grid");
    expect(agentGrid).toHaveClass("grid-cols-1", "md:grid-cols-3");
  });
});
