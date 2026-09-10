import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { GUIDE_NAV } from "@/lib/guide-nav";
import { t, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function StickyNav() {
  const locale = useI18n((s) => s.locale);
  const navigate = useNavigate({ from: "/$country/$city" });
  const search = useSearch({ from: "/$country/$city" });
  const [active, setActive] = useState<string>(search.s ?? GUIDE_NAV[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const nodes = GUIDE_NAV.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.25, 0.5] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!search.s) return;
    const node = document.getElementById(search.s);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [search.s]);

  const go = (id: (typeof GUIDE_NAV)[number]["id"]) => {
    setActive(id);
    void navigate({ search: { s: id }, replace: true });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label={t(locale).onThisPage} className="sticky top-0 z-20 border-b border-line bg-void/90 backdrop-blur-md">
      <div className="h-px w-full bg-line">
        <div className="h-px bg-accent transition-[width] duration-150 ease-out" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="mx-auto flex w-max min-w-full max-w-6xl flex-nowrap gap-1 px-4 py-2 md:px-8">
          {GUIDE_NAV.map((item) => (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => go(item.id)}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "block min-h-9 whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-150",
                  active === item.id ? "bg-accent text-void" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
