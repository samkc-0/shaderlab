// CodeEditor.tsx
import React, {
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useRef,
} from "react";

export interface CodeEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  highlight?: (code: string) => string; // should return HTML with <span> etc
  padding?: number;
  textareaId?: string;
  className?: string;
  style?: CSSProperties;
  readOnly?: boolean;
  // Optional hooks
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onValueChange,
  highlight,
  padding = 12,
  textareaId,
  className,
  style,
  readOnly = false,
  onKeyDown,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);

  const handleScroll = useCallback(() => {
    if (!textareaRef.current || !preRef.current) return;
    preRef.current.scrollTop = textareaRef.current.scrollTop;
    preRef.current.scrollLeft = textareaRef.current.scrollLeft;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onValueChange(e.target.value);
    },
    [onValueChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab -> insert spaces instead of changing focus
      if (!readOnly && e.key === "Tab") {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { selectionStart, selectionEnd, value: current } = textarea;
        const tabString = "  "; // or "\t" if you prefer real tabs

        const newValue =
          current.slice(0, selectionStart) +
          tabString +
          current.slice(selectionEnd);

        onValueChange(newValue);

        // Restore cursor position
        requestAnimationFrame(() => {
          const pos = selectionStart + tabString.length;
          textarea.selectionStart = textarea.selectionEnd = pos;
        });
        return;
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    },
    [onKeyDown, onValueChange, readOnly]
  );

  const highlightedHtml = highlight
    ? highlight(value)
    : escapeHtml(value).replace(/\n/g, "<br />");

  return (
    <div
      className={["code-editor-container", className].filter(Boolean).join(" ")}
      style={style}
    >
      {/* Highlight layer */}
      <pre
        ref={preRef}
        className="code-editor-pre"
        aria-hidden="true"
        style={{ padding }}
      >
        <code
          className="code-editor-code"
          dangerouslySetInnerHTML={{ __html: highlightedHtml + "\n" }}
        />
      </pre>

      {/* Actual input */}
      <textarea
        id={textareaId}
        ref={textareaRef}
        className="code-editor-textarea"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        style={{ padding }}
        readOnly={readOnly}
      />
    </div>
  );
};