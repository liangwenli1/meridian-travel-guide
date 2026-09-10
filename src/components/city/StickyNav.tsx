import { useEffect, useState } from "react";
import { GUIDE_NAV } from "@/lib/guide-nav";
import { cn } from "@/lib/utils";

export function StickyNav() {
  const [active, setActive] = useState<string>(GUIDE_NAV[0].id);

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

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-20 border-b border-line-paper bg-paper/90 backdrop-blur-md"
    >
      <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="mx-auto flex w-max min-w-full max-w-6xl flex-nowrap gap-1 px-4 py-2 md:px-8">
          {GUIDE_NAV.map((item) => (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                className={cn(
                  "block whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors",
                  active === item.id ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
