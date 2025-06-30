import { render, screen, fireEvent } from "@testing-library/react";
import { WorkbenchLayout } from "../workbench-layout";

// Mock the zustand store
jest.mock("@/store/workbench-store", () => ({
  useWorkbenchStore: () => ({
    systemLogs: [],
    addSystemLog: jest.fn(),
  }),
}));

describe("WorkbenchLayout", () => {
  test("renders workbench layout", () => {
    render(<WorkbenchLayout />);

    // Check if main elements exist
    expect(screen.getByText("Digital Workbench")).toBeDefined();
    expect(screen.getByText("PM Agent")).toBeDefined();
    expect(screen.getByText("Analyst Agent")).toBeDefined();
    expect(screen.getByText("Design Agent")).toBeDefined();
  });

  test("input field accepts text", () => {
    render(<WorkbenchLayout />);

    const input = screen.getByPlaceholderText(/Enter your request/);
    fireEvent.change(input, { target: { value: "Test request" } });

    expect((input as HTMLInputElement).value).toBe("Test request");
  });
});
