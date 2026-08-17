"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["p", "br", "b", "strong", "i", "em", "u", "ul", "ol", "li"],
  ALLOWED_ATTR: [] as string[],
};

export function sanitizeRichText(html: string) {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

// For places (like a Kanban card) that only need a short plain-text snippet.
export function richTextToPlainText(html: string) {
  return sanitizeRichText(html)
    .replace(/<\/(p|li|div)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TOOLBAR_ACTIONS = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
] as const;

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);

  // Only push external `value` changes into the DOM while the user isn't actively
  // typing — otherwise every keystroke's onChange->value round-trip would fight
  // the caret position.
  useEffect(() => {
    if (editorRef.current && !isFocused.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = sanitizeRichText(value || "");
    }
  }, [value]);

  const emitChange = () => {
    if (editorRef.current) {
      onChange(sanitizeRichText(editorRef.current.innerHTML));
    }
  };

  const runCommand = (command: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(command);
    emitChange();
  };

  const isEmpty = !value || value === "<br>" || value === "<p></p>";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)]",
        disabled && "opacity-60",
        className,
      )}
    >
      {!disabled && (
        <div className="flex items-center gap-0.5 border-b border-[var(--border)] px-1.5 py-1">
          {TOOLBAR_ACTIONS.map(({ command, icon: Icon, label }) => (
            <button
              key={command}
              type="button"
              title={label}
              aria-label={label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand(command)}
              className="rounded-md p-1.5 text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)] cursor-pointer"
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      )}
      <div className="relative">
        {isEmpty && placeholder && (
          <span className="pointer-events-none absolute left-3 top-2 text-sm text-[var(--fg-muted)]">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onFocus={() => {
            isFocused.current = true;
          }}
          onInput={emitChange}
          onBlur={() => {
            isFocused.current = false;
            emitChange();
            onBlur?.();
          }}
          className={cn(
            "min-h-24 px-3 py-2 text-sm text-[var(--fg)] outline-none",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
            disabled ? "cursor-not-allowed" : "cursor-text",
          )}
        />
      </div>
    </div>
  );
}
