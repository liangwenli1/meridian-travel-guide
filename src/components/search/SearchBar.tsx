import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Search } from "lucide-react";
import { searchCities, type SearchHit } from "@/lib/search/search-cities";
import type { City } from "@/types/catalog";

type SearchBarProps = {
  onSelect: (city: City) => void;
};

export function SearchBar({ onSelect }: SearchBarProps) {
  const inputId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const hits = useMemo(() => searchCities(query, 8), [query]);
  const visible = open && query.trim().length > 0;

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typingInField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (event.key === "/" && !typingInField) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  const choose = (hit: SearchHit) => {
    setQuery(`${hit.city.name}, ${hit.city.country}`);
    setOpen(false);
    onSelect(hit.city);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!hits.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((value) => (value + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((value) => (value - 1 + hits.length) % hits.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = hits[active] ?? hits[0];
      if (hit) choose(hit);
    }
  };

  return (
    <div ref={rootRef} className="relative mx-auto w-[min(92vw,34rem)]">
      <label htmlFor={inputId} className="sr-only">
        Search a city or country
      </label>
      <div className="flex h-12 items-center gap-3 rounded-full bg-void-elevated/80 px-4 shadow-[var(--shadow-border)] backdrop-blur-md md:h-14 md:px-5">
        <Search className="size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={visible}
          aria-controls={listId}
          aria-activedescendant={visible && hits[active] ? `${listId}-${hits[active].city.id}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-warm outline-none placeholder:text-muted/80 md:text-base"
          placeholder="Search a city or country"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <kbd className="hidden rounded-md px-1.5 py-0.5 font-sans text-[10px] tracking-wide text-muted shadow-[var(--shadow-border)] sm:inline">
          /
        </kbd>
      </div>
      {visible ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="City suggestions"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-[20px] bg-void-elevated/95 py-1 shadow-[var(--shadow-border)] backdrop-blur-md"
        >
          {hits.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">No matching city yet.</li>
          ) : (
            hits.map((hit, index) => (
              <li key={hit.city.id} role="presentation">
                <button
                  id={`${listId}-${hit.city.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                    index === active ? "bg-warm/8" : "hover:bg-warm/5"
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(hit)}
                >
                  <span>
                    <span className="block text-sm text-warm">{hit.city.name}</span>
                    <span className="block text-xs text-muted">{hit.city.country}</span>
                  </span>
                  <span className="rounded-full px-2 py-0.5 font-sans text-[10px] tracking-[0.14em] text-silver uppercase shadow-[var(--shadow-border)]">
                    {hit.city.countryCode}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
