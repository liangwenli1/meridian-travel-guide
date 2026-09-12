import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardMeta } from "@/components/ui/Card";
import { t, useI18n } from "@/lib/i18n";

type Need = "content" | "features";

type PassGateProps = {
  active: boolean;
  children?: ReactNode;
  teaserTitle?: string;
  teaserBody?: string;
  className?: string;
  need?: Need;
};

export function PassGate({
  active,
  children,
  teaserTitle,
  teaserBody,
  className,
  need = "content",
}: PassGateProps) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);

  if (active) return <>{children}</>;

  const title =
    teaserTitle ?? (need === "features" ? strings.gateFeaturesTitle : strings.gateContentTitle);
  const body = teaserBody ?? (need === "features" ? strings.gateFeaturesDek : strings.gateContentDek);

  return (
    <Card className={className} padding="md">
      <CardMeta>{need === "features" ? strings.planMax : strings.passMembersOnly}</CardMeta>
      <p className="mt-2 text-base font-medium text-fg">{title}</p>
      {body ? <CardDescription>{body}</CardDescription> : null}
      <div className="mt-4">
        <Button asChild size="sm">
          <Link to="/pass">{need === "features" ? strings.passCtaMax : strings.passCta}</Link>
        </Button>
      </div>
    </Card>
  );
}

export function LockedRest({
  open,
  need = "content",
  teaserTitle,
  teaserBody,
  children,
  className,
}: {
  open: boolean;
  need?: Need;
  teaserTitle?: string;
  teaserBody?: string;
  children: ReactNode;
  className?: string;
}) {
  if (open) return <>{children}</>;
  return (
    <PassGate
      active={false}
      need={need}
      teaserTitle={teaserTitle}
      teaserBody={teaserBody}
      className={className}
    />
  );
}
