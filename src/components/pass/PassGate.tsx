import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { t, useI18n } from "@/lib/i18n";

type PassGateProps = {
  active: boolean;
  children: ReactNode;
  teaserTitle?: string;
  teaserBody?: string;
  className?: string;
};

export function PassGate({
  active,
  children,
  teaserTitle,
  teaserBody,
  className,
}: PassGateProps) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);

  if (active) return <>{children}</>;

  return (
    <div className={className ?? "rounded-3xl bg-card px-5 py-4 shadow-border"}>
      <p className="kicker text-muted">{strings.passMembersOnly}</p>
      <p className="mt-2 text-base font-medium text-fg">
        {teaserTitle ?? strings.passTeaser}
      </p>
      {teaserBody ? <p className="mt-1 text-sm text-muted">{teaserBody}</p> : null}
      <div className="mt-3">
        <Button asChild size="sm">
          <Link to="/pass">{strings.passCta}</Link>
        </Button>
      </div>
    </div>
  );
}
