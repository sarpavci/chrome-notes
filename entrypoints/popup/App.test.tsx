import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Mock chrome.storage.sync
let storageStore: Record<string, string> = {};

const storageMock = {
  get: vi.fn((
    _keys: string | string[],
    callback: (result: Record<string, string>) => void
  ) => {
    callback({ ...storageStore });
  }),
  set: vi.fn((items: Record<string, string>, callback?: () => void) => {
    storageStore = { ...storageStore, ...items };
    callback?.();
  }),
};

Object.defineProperty(globalThis, "chrome", {
  value: { storage: { sync: storageMock } },
  writable: true,
  configurable: true,
});

// Mock navigator.clipboard
const writeText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, "clipboard", {
  value: { writeText },
  writable: true,
  configurable: true,
});

beforeEach(() => {
  storageStore = {};
  vi.clearAllMocks();
  writeText.mockResolvedValue(undefined);
  storageMock.get.mockImplementation((
    _k: string | string[],
    cb: (r: Record<string, string>) => void
  ) => cb({ ...storageStore }));
  storageMock.set.mockImplementation((
    items: Record<string, string>,
    callback?: () => void
  ) => {
    storageStore = { ...storageStore, ...items };
    callback?.();
  });
});

describe("App — restore on open", () => {
  it("restores saved note from storage on mount", async () => {
    storageStore = { note: "my saved note" };
    storageMock.get.mockImplementationOnce((
      _k: string | string[],
      cb: (r: Record<string, string>) => void
    ) => cb({ note: "my saved note" }));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("my saved note");
    });
  });

  it("shows 'Saved' status after restoring on open", async () => {
    storageMock.get.mockImplementationOnce((
      _k: string | string[],
      cb: (r: Record<string, string>) => void
    ) => cb({ note: "existing text" }));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });
});

describe("App — auto-save debounce", () => {
  it("shows 'Saving…' while typing", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    render(<App />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });

    expect(screen.getByText("Saving…")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("saves to chrome.storage.sync after 500ms debounce", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    render(<App />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello world" } });

    expect(storageMock.set).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(500); });

    expect(storageMock.set).toHaveBeenCalledWith(
      { note: "hello world" },
      expect.any(Function)
    );

    vi.useRealTimers();
  });

  it("shows 'Saved' after debounce completes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    render(<App />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test" } });

    act(() => { vi.advanceTimersByTime(500); });

    expect(screen.getByText("Saved")).toBeInTheDocument();

    vi.useRealTimers();
  });
});

describe("App — copy button", () => {
  it("copy button is disabled when textarea is empty", () => {
    render(<App />);
    expect(screen.getByTitle("Copy")).toBeDisabled();
  });

  it("copy button is enabled when textarea has content", async () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "some text" } });
    expect(screen.getByTitle("Copy")).not.toBeDisabled();
  });

  it("copies full content to clipboard on click", async () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "copy me" } });
    await userEvent.click(screen.getByTitle("Copy"));
    expect(writeText).toHaveBeenCalledWith("copy me");
  });

  it("shows 'Copied!' title for 1.5s after copying", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    render(<App />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "copy me" } });

    // Use fireEvent.click to avoid userEvent + fake timer issues
    await act(async () => {
      fireEvent.click(screen.getByTitle("Copy"));
    });

    expect(screen.getByTitle("Copied!")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(1500); });

    expect(screen.getByTitle("Copy")).toBeInTheDocument();
    expect(screen.queryByTitle("Copied!")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});

describe("App — clear confirm flow", () => {
  it("clear button is disabled when textarea is empty", () => {
    render(<App />);
    expect(screen.getByTitle("Clear")).toBeDisabled();
  });

  it("clear button is enabled when textarea has content", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "some text" } });
    expect(screen.getByTitle("Clear")).not.toBeDisabled();
  });

  it("shows inline confirm when clear is clicked", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "some text" } });
    fireEvent.click(screen.getByTitle("Clear"));

    expect(screen.getByText("Clear all notes?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("cancels and restores header when Cancel is clicked", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "some text" } });
    fireEvent.click(screen.getByTitle("Clear"));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByText("Clear all notes?")).not.toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("clears content and disables buttons when Clear is confirmed", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    render(<App />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "delete me" } });
    fireEvent.click(screen.getByTitle("Clear"));
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.getByRole("textbox")).toHaveValue("");

    act(() => { vi.advanceTimersByTime(500); });

    expect(storageMock.set).toHaveBeenCalledWith({ note: "" }, expect.any(Function));
    expect(screen.getByTitle("Copy")).toBeDisabled();
    expect(screen.getByTitle("Clear")).toBeDisabled();

    vi.useRealTimers();
  });
});
