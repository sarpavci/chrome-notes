import { useState, useEffect, useRef, useCallback } from "react";

type SaveStatus = "saved" | "saving";
type HeaderMode = "normal" | "confirm-clear";

export default function App() {
  const [note, setNote] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [headerMode, setHeaderMode] = useState<HeaderMode>("normal");
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore on open
  useEffect(() => {
    chrome.storage.sync.get("note", (result) => {
      if (result.note !== undefined) {
        setNote(result.note as string);
      }
      setSaveStatus("saved");
    });
  }, []);

  const saveNote = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");
    debounceRef.current = setTimeout(() => {
      chrome.storage.sync.set({ note: value }, () => {
        setSaveStatus("saved");
      });
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    saveNote(value);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(note);
    setCopied(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopied(false), 1500);
  };

  const handleClearClick = () => {
    setHeaderMode("confirm-clear");
  };

  const handleCancelClear = () => {
    setHeaderMode("normal");
    textareaRef.current?.focus();
  };

  const handleConfirmClear = () => {
    setNote("");
    setHeaderMode("normal");
    saveNote("");
    textareaRef.current?.focus();
  };

  const isEmpty = note.length === 0;

  return (
    <div className="w-[360px] h-[480px] bg-white flex flex-col" style={{ fontFamily: "Roboto, system-ui, sans-serif" }}>
      {/* Header */}
      <div className="h-12 flex items-center px-3 flex-shrink-0" style={{ borderBottom: "1px solid #DADCE0" }}>
        {headerMode === "normal" ? (
          <>
            <span className="flex-1 text-sm font-medium" style={{ color: "#202124", fontSize: 14, fontWeight: 500 }}>
              Notes
            </span>
            <button
              title={copied ? "Copied!" : "Copy"}
              onClick={handleCopy}
              disabled={isEmpty}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={copied ? "Copied!" : "Copy"}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#5F6368" }}>
                content_copy
              </span>
            </button>
            <button
              title="Clear"
              onClick={handleClearClick}
              disabled={isEmpty}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed ml-1"
              aria-label="Clear"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#5F6368" }}>
                delete
              </span>
            </button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm" style={{ color: "#202124", fontSize: 13 }}>
              Clear all notes?
            </span>
            <button
              onClick={handleCancelClear}
              className="px-3 py-1 text-sm rounded hover:bg-gray-100"
              style={{ color: "#1A73E8", fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClear}
              className="px-3 py-1 text-sm rounded hover:bg-red-50 ml-1"
              style={{ color: "#D93025", fontSize: 13 }}
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        autoFocus
        value={note}
        onChange={handleChange}
        placeholder="Start typing your note…"
        className="flex-1 resize-none border-none outline-none p-3"
        style={{
          fontSize: 13,
          color: "#202124",
          fontFamily: "inherit",
          lineHeight: 1.5,
        }}
      />

      {/* Status footer */}
      <div
        className="h-7 flex items-center px-3 flex-shrink-0"
        style={{ borderTop: "1px solid #DADCE0" }}
      >
        <span style={{ fontSize: 13, color: "#5F6368" }}>
          {saveStatus === "saving" ? "Saving…" : "Saved"}
        </span>
      </div>
    </div>
  );
}
