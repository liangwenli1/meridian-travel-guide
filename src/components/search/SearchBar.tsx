import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowRight, Search } from "lucide-react";
import { recordSearch } from "@/lib/server/catalog";
import { t, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { searchCitiesIn, type SearchHit } from "@/lib/search/search-cities";
import type { City, Country } from "@/types/catalog";

type SearchBarProps = {
  cities: City[];
  countries: Country[];
  onSelect: (city: City) => void;
  className?: string;
};

export function SearchBar({ cities, countries, onSelect, className }: SearchBarProps) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const inputId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const hits = useMemo(() => searchCitiesIn(cities, countries, query, 8), [cities, countries, query]);
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
    void recordSearch({ data: { query, resultCityId: hit.city.id } }).catch(() => undefined);
    onSelect(hit.city);
  };

  const submit = () => {
    const hit = hits[active] ?? hits[0];
    if (hit) choose(hit);
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
      submit();
    }
  };

  return (
    <div ref={rootRef} className={cn("relative mx-auto w-full max-w-[40rem]", className)}>
      <label htmlFor={inputId} className="sr-only">
        {strings.search}
      </label>
      <div className="flex h-12 items-center gap-3 rounded-full bg-void-elevated py-1 pr-1 pl-5 shadow-border md:h-14">
        <Search className="size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={visible}
          aria-controls={listId}
          aria-activedescendant={visible && hits[active] ? `${listId}-${hits[active].city.id}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-muted"
          placeholder={strings.search}
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
        <button
          type="button"
          aria-label={strings.explore}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-void transition-transform duration-150 ease-out hover:bg-accent-dim active:scale-[0.96]"
          onClick={submit}
        >
          <ArrowRight className="size-5" strokeWidth={2.2} />
        </button>
      </div>
      {visible ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={strings.search}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl bg-void-elevated py-1 shadow-border"
        >
          {hits.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">{strings.noMatch}</li>
          ) : (
            hits.map((hit, index) => (
              <li key={hit.city.id} role="presentation">
                <button
                  id={`${listId}-${hit.city.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                    index === active ? "bg-fg/5" : "hover:bg-fg/5"
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(hit)}
                >
                  <span>
                    <span className="block text-sm text-fg">{hit.city.name}</span>
                    <span className="block text-xs text-muted">{hit.city.country}</span>
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-2xs tracking-widest text-silver uppercase shadow-border">
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
