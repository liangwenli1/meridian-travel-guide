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
  cityName?: string;
};

export function PassGate({
  active,
  children,
  teaserTitle,
  teaserBody,
  className,
  need = "content",
  cityName,
}: PassGateProps) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);

  if (active) return <>{children}</>;

  const title =
    teaserTitle ?? (need === "features" ? strings.gateFeaturesTitle : strings.gateContentTitle);
  const body = teaserBody ?? (need === "features" ? strings.gateFeaturesDek : strings.gateContentDek);
  const cta =
    need === "features"
      ? strings.passCtaMax
      : cityName
        ? strings.gateUnlock.replace("{city}", cityName)
        : strings.passCta;

  return (
    <Card className={className} padding="md">
      <CardMeta>{need === "features" ? strings.planMax : "Pro"}</CardMeta>
      <p className="mt-2 text-base font-medium text-fg">{title}</p>
      {need === "content" ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>{strings.gateStay}</li>
          <li>{strings.gateDates}</li>
          <li>{strings.gateDays}</li>
        </ul>
      ) : null}
      {body ? <CardDescription>{body}</CardDescription> : null}
      <div className="mt-4">
        <Button asChild size="sm">
          <Link to="/pass">{cta}</Link>
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
  cityName,
}: {
  open: boolean;
  need?: Need;
  teaserTitle?: string;
  teaserBody?: string;
  children: ReactNode;
  className?: string;
  cityName?: string;
}) {
  if (open) return <>{children}</>;
  return (
    <PassGate
      active={false}
      need={need}
      teaserTitle={teaserTitle}
      teaserBody={teaserBody}
      className={className}
      cityName={cityName}
    />
  );
}
