import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

interface TabsProps {
  label: string;
  items: TabItem[];
}

export function Tabs({ label, items }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function activate(index: number) {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        activate((activeIndex + 1) % items.length);
        break;
      case "ArrowLeft":
        event.preventDefault();
        activate((activeIndex - 1 + items.length) % items.length);
        break;
      case "Home":
        event.preventDefault();
        activate(0);
        break;
      case "End":
        event.preventDefault();
        activate(items.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs-list">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className="tabs-tab"
              onClick={() => activate(index)}
              onKeyDown={handleKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={index !== activeIndex}
          tabIndex={0}
          className="tabs-panel"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
