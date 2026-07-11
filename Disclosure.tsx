import { useId, useState, type ReactNode } from "react";

interface DisclosureProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="disclosure">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        className="disclosure-trigger"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className={`disclosure-caret ${open ? "disclosure-caret-open" : ""}`}>
          ▸
        </span>
        {summary}
      </button>
      <div id={contentId} role="region" aria-label={summary} hidden={!open} className="disclosure-content">
        {children}
      </div>
    </div>
  );
}
