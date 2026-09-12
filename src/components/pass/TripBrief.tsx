import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardMeta, CardTitle } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { getTripSpec, type Party } from "@/data/pass/trip-briefs";
import { t, useI18n } from "@/lib/i18n";
import { buildTripBrief, briefToMarkdown, defaultArriveDate, loc, weekdayLabel } from "@/lib/trip-brief";
import { PassGate } from "./PassGate";

function bookingBadge(status: "ok" | "this-week" | "late", late: string, soon: string, ok: string) {
  if (status === "late") return { variant: "warn" as const, label: late };
  if (status === "this-week") return { variant: "accent" as const, label: soon };
  return { variant: "ok" as const, label: ok };
}

export function TripBrief({
  citySlug,
  cityName,
  countrySlug,
  canReadFull,
  canUseTools,
}: {
  citySlug: string;
  cityName: string;
  countrySlug: string;
  canReadFull: boolean;
  canUseTools: boolean;
}) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const spec = getTripSpec(citySlug);
  const [arrive, setArrive] = useState(defaultArriveDate);
  const [nights, setNights] = useState(4);
  const [party, setParty] = useState<Party>("couple");

  const brief = useMemo(
    () => buildTripBrief({ citySlug, arrive, nights, party }),
    [citySlug, arrive, nights, party],
  );

  if (!spec || !brief) return null;

  const download = () => {
    const markdown = briefToMarkdown(brief, locale, cityName);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${citySlug}-brief-${arrive}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const teaserBooking = brief.bookings[0];
  const teaserClosed = brief.closures[0];

  return (
    <section className="mt-12">
      <p className="kicker text-accent">{strings.briefKicker}</p>
      <h2 className="mt-2 text-3xl font-medium tracking-tight">{strings.briefTitle}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{strings.briefDek}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{strings.briefArrive}</span>
          <DatePicker value={arrive} onChange={setArrive} locale={locale} />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{strings.briefNights}</span>
          <Select value={String(nights)} onValueChange={(value) => setNights(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 7].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{strings.briefParty}</span>
          <Select value={party} onValueChange={(value) => setParty(value as Party)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">{strings.briefSolo}</SelectItem>
              <SelectItem value="couple">{strings.briefCouple}</SelectItem>
              <SelectItem value="family">{strings.briefFamily}</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>

      {!canReadFull ? (
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card padding="md">
          <CardMeta>{strings.briefBookNow}</CardMeta>
          {teaserBooking ? (
            <>
              <CardTitle className="mt-2 text-lg">{loc(teaserBooking.name, locale)}</CardTitle>
              <div className="mt-2">
                <Badge variant={bookingBadge(teaserBooking.status, strings.briefLate, strings.briefSoon, strings.briefOk).variant}>
                  {bookingBadge(teaserBooking.status, strings.briefLate, strings.briefSoon, strings.briefOk).label}
                </Badge>
              </div>
              <CardDescription>
                {teaserBooking.status === "late" ? loc(teaserBooking.skipIfLate, locale) : strings.briefBookHint}
              </CardDescription>
            </>
          ) : null}
        </Card>
        <Card padding="md">
          <CardMeta>{strings.briefClosed}</CardMeta>
          <CardTitle className="mt-2 text-lg">
            {teaserClosed
              ? `${teaserClosed.date} · ${weekdayLabel(teaserClosed.weekday, locale)}`
              : strings.briefNoClosed}
          </CardTitle>
          <CardDescription>
            {teaserClosed ? loc(teaserClosed.places, locale) : strings.briefNoClosedDek}
          </CardDescription>
        </Card>
      </div>
      ) : null}

      <PassGate
        className="mt-4"
        active={canReadFull}
        teaserTitle={strings.briefPaywall}
        teaserBody={strings.briefPaywallDek}
      >
        <div className="mt-4 space-y-4">
          <Card padding="md">
            <CardMeta>{strings.briefBookNow}</CardMeta>
            <ul className="mt-3 space-y-3">
              {brief.bookings.map((row) => {
                const badge = bookingBadge(row.status, strings.briefLate, strings.briefSoon, strings.briefOk);
                return (
                  <li key={row.name.en} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{loc(row.name, locale)}</p>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{loc(row.skipIfLate, locale)}</p>
                  </li>
                );
              })}
            </ul>
          </Card>

          {brief.closures.length > 1 ? (
            <Card padding="md">
              <CardMeta>{strings.briefClosed}</CardMeta>
              <ul className="mt-3 space-y-2 text-sm">
                {brief.closures.map((row) => (
                  <li key={row.date + row.weekday}>
                    <span className="font-mono text-xs text-muted">
                      {row.date} · {weekdayLabel(row.weekday, locale)}
                    </span>
                    <p className="mt-1 text-fg">{loc(row.places, locale)}</p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <Card padding="md">
            <CardMeta>{strings.briefStay}</CardMeta>
            <ul className="mt-3 space-y-2 text-sm">
              {brief.stayYes.map((row) => (
                <li key={row.name.en}>
                  <p className="font-medium">{loc(row.name, locale)}</p>
                  <p className="text-muted">{loc(row.who, locale)}</p>
                </li>
              ))}
              <li className="border-t border-line pt-3">
                <p className="font-medium">
                  {strings.briefStayNo}: {loc(brief.stayNo.name, locale)}
                </p>
                <p className="text-muted">{loc(brief.stayNo.why, locale)}</p>
              </li>
            </ul>
          </Card>

          <Card padding="md">
            <CardMeta>{strings.briefWaste}</CardMeta>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-fg">
              {brief.waste.map((row) => (
                <li key={row.en}>{loc(row, locale)}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{loc(brief.skipPass, locale)}</p>
          </Card>

          <Card padding="md">
            <CardMeta>{strings.briefWallet}</CardMeta>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              {brief.wallet.map((row) => (
                <li key={row.en}>{loc(row, locale)}</li>
              ))}
            </ul>
          </Card>

          <Card padding="md">
            <CardMeta>{strings.briefArriveHours}</CardMeta>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              {brief.arrival.map((row) => (
                <li key={row.en}>{loc(row, locale)}</li>
              ))}
            </ul>
            {brief.season ? <p className="mt-4 text-sm text-muted">{loc(brief.season, locale)}</p> : null}
            <p className="mt-3 text-sm text-fg">{loc(brief.partyNote, locale)}</p>
          </Card>

          <div className="flex flex-wrap gap-2">
            {canUseTools ? (
              <Button type="button" variant="outline" size="sm" onClick={download}>
                {strings.passDownloadItinerary}
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/pass">{strings.passCtaMax}</Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link to="/$country/$city" params={{ country: countrySlug, city: citySlug }} search={{ s: "itinerary" }}>
                {strings.briefOpenPlan}
              </Link>
            </Button>
          </div>
        </div>
      </PassGate>
    </section>
  );
}
