import { Link } from "@tanstack/react-router";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({
  className,
  overlay = false,
}: {
  className?: string;
  overlay?: boolean;
}) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { isPending } = useCurrentUserState();

  return (
    <header
      className={cn(
        "relative z-20 flex items-center justify-between gap-3 px-6 py-4 md:px-12 lg:px-16",
        overlay && "absolute top-0 right-0 left-0",
        className,
      )}
    >
      <Link to="/" className="text-xl font-medium tracking-tight text-fg">
        {SITE.name}
      </Link>
      <div className="flex items-center gap-2 md:gap-3">
        <LanguageToggle />
        {isPending ? (
          <div className="size-9 animate-pulse rounded-full bg-void-elevated" />
        ) : (
          <>
            <SignedOut>
              <Button asChild variant="outline" size="sm">
                <Link to="/login">{strings.signIn}</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        )}
      </div>
    </header>
  );
}
