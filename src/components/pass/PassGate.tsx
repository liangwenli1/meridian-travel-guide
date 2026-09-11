import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardMeta } from "@/components/ui/Card";
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
    <Card className={className} padding="md">
      <CardMeta>{strings.passMembersOnly}</CardMeta>
      <p className="mt-2 text-base font-medium text-fg">{teaserTitle ?? strings.passTeaser}</p>
      {teaserBody ? <CardDescription>{teaserBody}</CardDescription> : null}
      <div className="mt-4">
        <Button asChild size="sm">
          <Link to="/pass">{strings.passCta}</Link>
        </Button>
      </div>
    </Card>
  );
}
