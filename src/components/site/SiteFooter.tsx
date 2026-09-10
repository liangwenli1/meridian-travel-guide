import { Link } from "@tanstack/react-router";
import { publishedCities } from "@/data/cities";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-void">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="text-lg font-medium tracking-tight text-fg">{SITE.name}</p>
          <p className="mt-2 max-w-sm text-sm text-muted">{SITE.tagline}</p>
        </div>
        <nav aria-label="Published guides" className="flex flex-wrap gap-2">
          {publishedCities.map((city) => (
            <Button key={city.id} asChild variant="outline" size="sm">
              <Link to="/$country/$city" params={{ country: city.countrySlug, city: city.slug }}>
                {city.name}
              </Link>
            </Button>
          ))}
          <Button asChild size="sm">
            <Link to="/">Globe</Link>
          </Button>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted md:px-8">
        Earth land mask derived from NASA Earth Observatory (public domain). City photos: Unsplash.
      </p>
    </footer>
  );
}
