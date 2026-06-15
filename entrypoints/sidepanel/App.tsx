import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Trash2, Check } from "lucide-react";

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
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: "#0f1011",
        borderLeft: "1px solid rgba(255,255,255,.08)",
        fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
        fontFeatureSettings: '"cv01", "ss03"',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center px-3 flex-shrink-0"
        style={{
          height: 48,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {headerMode === "normal" ? (
          <>
            <span
              className="flex-1"
              style={{ color: "#f7f8f8", fontSize: 14, fontWeight: 510 }}
            >
              Notes
            </span>
            <button
              title={copied ? "Copied!" : "Copy"}
              onClick={handleCopy}
              disabled={isEmpty}
              className="w-8 h-8 flex items-center justify-center rounded disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "#8a8f98" }}
              onMouseEnter={(e) => {
                if (!isEmpty) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f7f8f8";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#8a8f98";
              }}
              aria-label={copied ? "Copied!" : "Copy"}
            >
              {copied ? <Check size={18} style={{ color: "#7170ff" }} /> : <Copy size={18} />}
            </button>
            <button
              title="Clear"
              onClick={handleClearClick}
              disabled={isEmpty}
              className="w-8 h-8 flex items-center justify-center rounded disabled:opacity-40 disabled:cursor-not-allowed ml-1"
              style={{ color: "#8a8f98" }}
              onMouseEnter={(e) => {
                if (!isEmpty) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f7f8f8";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#8a8f98";
              }}
              aria-label="Clear"
            >
              <Trash2 size={18} />
            </button>
          </>
        ) : (
          <>
            <span
              className="flex-1"
              style={{ color: "#d0d6e0", fontSize: 13, fontWeight: 400 }}
            >
              Clear all notes?
            </span>
            <button
              onClick={handleCancelClear}
              className="px-3 py-1 text-sm rounded"
              style={{ color: "#7170ff", fontSize: 13 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClear}
              className="px-3 py-1 text-sm rounded ml-1"
              style={{ color: "#eb5757", fontSize: 13 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(235,87,87,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* Textarea — flex:1, full height */}
      <textarea
        ref={textareaRef}
        autoFocus
        value={note}
        onChange={handleChange}
        placeholder="Start typing your note…"
        className="flex-1 resize-none border-none outline-none"
        style={{
          padding: 12,
          fontSize: 13,
          color: "#f7f8f8",
          backgroundColor: "transparent",
          fontFamily: "inherit",
          fontFeatureSettings: "inherit",
          lineHeight: 1.5,
          caretColor: "#7170ff",
        }}
      />

      {/* Status footer */}
      <div
        className="flex items-center px-3 flex-shrink-0"
        style={{
          height: 28,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span style={{ fontSize: 13, color: "#8a8f98" }}>
          {saveStatus === "saving" ? "Saving…" : "Saved"}
        </span>
      </div>
    </div>
  );
}
