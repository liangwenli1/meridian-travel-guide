import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { PaymentDesk } from "@/components/admin/PaymentDesk";
import { DeskFrame, DeskStat } from "@/components/desk/DeskFrame";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cities as seedCities } from "@/data/cities";
import { listDispatches } from "@/data/dispatches";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n, type Locale } from "@/lib/i18n";
import { sendTestEmail } from "@/lib/server/email-verify";
import { getHomeCatalog, setCityStatus } from "@/lib/server/catalog";
import { getOpsOverview, listMembers, type MemberRow, type OpsOverview } from "@/lib/server/desk";
import { listLetterSubscribers, sendLetterIssue, type LetterSubscriber } from "@/lib/server/letter";
import {
  claimAdmin,
  getAdminState,
  getSmtpSettings,
  saveSmtpSettings,
  type SmtpPublic,
} from "@/lib/server/ops";
import { SITE } from "@/lib/site";
import type { City, ContentStatus } from "@/types/catalog";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: `Operations · ${SITE.name}` }],
  }),
});

const fieldClass =
  "h-12 w-full rounded-2xl bg-void-elevated px-4 text-sm text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover";

type Tab = "overview" | "cities" | "dispatches" | "letter" | "mail" | "pay" | "members";
type CityFilter = "all" | ContentStatus;
type LetterFilter = "all" | "active" | "unsubscribed";

function AdminPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const [gate, setGate] = useState<"load" | "claim" | "admin" | "denied">("load");
  const [tab, setTab] = useState<Tab>("overview");
  const [smtp, setSmtp] = useState<SmtpPublic | null>(null);
  const [password, setPassword] = useState("");
  const [testTo, setTestTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [overview, setOverview] = useState<OpsOverview | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [letterRows, setLetterRows] = useState<LetterSubscriber[]>([]);
  const [cityRows, setCityRows] = useState<City[]>(seedCities);
  const [cityFilter, setCityFilter] = useState<CityFilter>("all");
  const [letterFilter, setLetterFilter] = useState<LetterFilter>("all");

  const loadAdminData = () =>
    Promise.all([
      getSmtpSettings().then(setSmtp),
      getOpsOverview().then(setOverview),
      listMembers().then(setMembers),
      listLetterSubscribers().then(setLetterRows).catch(() => setLetterRows([])),
      getHomeCatalog()
        .then((data) => setCityRows(data.cities))
        .catch(() => setCityRows(seedCities)),
    ]);

  useEffect(() => {
    if (isPending || !userId) return;
    void getAdminState()
      .then((state) => {
        if (state.isAdmin) {
          setGate("admin");
          return loadAdminData();
        }
        setGate(state.canClaim ? "claim" : "denied");
      })
      .catch(() => setGate("denied"));
  }, [isPending, userId]);

  const filteredCities = useMemo(() => {
    const rows = [...cityRows].sort((a, b) => b.tourismPriority - a.tourismPriority || a.name.localeCompare(b.name));
    if (cityFilter === "all") return rows;
    return rows.filter((city) => city.contentStatus === cityFilter);
  }, [cityFilter, cityRows]);

  const dispatches = useMemo(() => listDispatches(), []);

  const filteredLetter = useMemo(() => {
    if (letterFilter === "all") return letterRows;
    return letterRows.filter((row) => row.status === letterFilter);
  }, [letterFilter, letterRows]);

  if (isPending) {
    return (
      <main className="min-h-dvh bg-void text-fg">
        <div className="mx-auto max-w-xl px-6 py-24">
          <div className="h-10 w-40 animate-pulse rounded-3xl bg-void-elevated" />
        </div>
      </main>
    );
  }

  if (!user) return <RedirectToSignIn />;

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!smtp) return;
    setSaving(true);
    try {
      const next = await saveSmtpSettings({
        data: {
          enabled: smtp.enabled,
          host: smtp.host,
          port: smtp.port,
          username: smtp.username,
          password,
          fromName: smtp.fromName,
          fromEmail: smtp.fromEmail,
          secure: smtp.secure,
        },
      });
      setSmtp(next);
      setPassword("");
      toast.success(strings.smtpSaved);
      void getOpsOverview().then(setOverview);
    } catch {
      toast.error(strings.authFailed);
    } finally {
      setSaving(false);
    }
  };

  const filterChip = (label: string, on: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={
        on
          ? "rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-void"
          : "rounded-full border border-line px-3.5 py-1.5 text-xs text-muted hover:border-line-strong hover:text-fg"
      }
    >
      {label}
    </button>
  );

  return (
    <DeskFrame
      tone="ops"
      kicker={strings.opsKicker}
      title={strings.opsTitle}
      dek={strings.opsDek}
      nav={[
        { label: strings.opsOverview, current: tab === "overview", onClick: () => setTab("overview") },
        { label: strings.opsCities, current: tab === "cities", onClick: () => setTab("cities") },
        { label: strings.opsDispatches, current: tab === "dispatches", onClick: () => setTab("dispatches") },
        { label: strings.opsLetter, current: tab === "letter", onClick: () => setTab("letter") },
        { label: strings.tabMail, current: tab === "mail", onClick: () => setTab("mail") },
        { label: strings.tabPay, current: tab === "pay", onClick: () => setTab("pay") },
        { label: strings.opsMembers, current: tab === "members", onClick: () => setTab("members") },
      ]}
    >
      {gate === "claim" ? (
        <Button
          size="lg"
          onClick={() => {
            void claimAdmin()
              .then((state) => {
                if (!state.isAdmin) return;
                setGate("admin");
                return loadAdminData();
              })
              .catch(() => toast.error(strings.authFailed));
          }}
        >
          {strings.claimAdmin}
        </Button>
      ) : null}

      {gate === "denied" ? <p className="text-sm text-muted">{strings.adminDenied}</p> : null}

      {gate === "admin" && tab === "overview" && overview ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <DeskStat label={strings.opsUsers} value={overview.users} />
          <DeskStat label={strings.opsPasses} value={overview.passes} />
          <DeskStat label={strings.opsPending} value={overview.pendingOrders} />
          <DeskStat label={strings.opsPaid} value={overview.paidOrders} />
          <DeskStat label={strings.tabMail} value={overview.smtpOn ? strings.opsOn : strings.opsOff} />
          <DeskStat label={strings.tabPay} value={overview.payOn ? strings.opsOn : strings.opsOff} />
          <DeskStat label={strings.opsLetter} value={letterRows.length} />
          <DeskStat label={strings.opsCities} value={cityRows.length} />
          <DeskStat label={strings.opsDispatches} value={dispatches.length} />
        </div>
      ) : null}

      {gate === "admin" && tab === "cities" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {filterChip(strings.opsFilterAll, cityFilter === "all", () => setCityFilter("all"))}
            {filterChip(strings.opsFilterPublished, cityFilter === "published", () => setCityFilter("published"))}
            {filterChip(strings.opsFilterComing, cityFilter === "coming-soon", () => setCityFilter("coming-soon"))}
          </div>
          <p className="text-xs text-muted">
            {filteredCities.length} {strings.opsCitiesCount}
          </p>
          {filteredCities.length === 0 ? (
            <EmptyState title={strings.opsCitiesEmpty} />
          ) : (
            <div className="overflow-x-auto rounded-3xl bg-card shadow-border">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">{strings.opsCityCol}</th>
                    <th className="px-5 py-3 font-medium">{strings.opsCountryCol}</th>
                    <th className="px-5 py-3 font-medium">{strings.opsStatusCol}</th>
                    <th className="px-5 py-3 font-medium">{strings.opsPriorityCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCities.map((city) => (
                    <tr key={city.id} className="border-t border-line">
                      <td className="px-5 py-3 font-medium text-fg">{city.name}</td>
                      <td className="px-5 py-3 text-muted">{city.country}</td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => {
                            const next = city.contentStatus === "published" ? "coming-soon" : "published";
                            void setCityStatus({ data: { slug: city.slug, status: next } })
                              .then(() => {
                                setCityRows((rows) =>
                                  rows.map((row) =>
                                    row.slug === city.slug ? { ...row, contentStatus: next } : row,
                                  ),
                                );
                              })
                              .catch(() => toast.error(strings.authFailed));
                          }}
                        >
                          <Badge variant={city.contentStatus === "published" ? "accent" : "muted"}>
                            {city.contentStatus === "published" ? strings.opsPublished : strings.opsComingSoon}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs tabular-nums text-muted">
                        {city.tourismPriority}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {gate === "admin" && tab === "dispatches" ? (
        dispatches.length === 0 ? (
          <EmptyState title={strings.opsDispatchesEmpty} />
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-card shadow-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">{strings.opsDispatchDate}</th>
                  <th className="px-5 py-3 font-medium">{strings.opsDispatchTitle}</th>
                  <th className="px-5 py-3 font-medium">{strings.opsDispatchTier}</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.map((item) => (
                  <tr key={item.slug} className="border-t border-line">
                    <td className="px-5 py-3 font-mono text-xs text-muted">{item.date}</td>
                    <td className="px-5 py-3">
                      <Link
                        to="/desk/$slug"
                        params={{ slug: item.slug }}
                        className="font-medium text-fg hover:text-accent"
                      >
                        {item.title[locale as Locale]}
                      </Link>
                      <p className="mt-1 text-xs text-muted">{item.kicker[locale as Locale]}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={item.tier === "pass-briefing" ? "accent" : "muted"}>
                        {item.tier === "pass-briefing" ? strings.deskPassOnly : strings.deskLetterFree}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}

      {gate === "admin" && tab === "letter" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-void-elevated px-4 py-3 text-sm text-muted">
            {strings.opsLetterBanner}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filterChip(strings.opsFilterAll, letterFilter === "all", () => setLetterFilter("all"))}
            {filterChip(strings.opsFilterActive, letterFilter === "active", () => setLetterFilter("active"))}
            {filterChip(strings.opsFilterUnsubscribed, letterFilter === "unsubscribed", () =>
              setLetterFilter("unsubscribed"),
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const header = "email,locale,city,status,createdAt\n";
                const body = filteredLetter
                  .map((row) =>
                    [row.email, row.locale, row.citySlug ?? "", row.status, row.createdAt.slice(0, 10)].join(","),
                  )
                  .join("\n");
                const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "letter-subscribers.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              {strings.opsLetterCsv}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void sendLetterIssue({ data: { testOnly: true } }).then((result) => {
                  if (result.error && !result.sent) toast.error(result.error);
                  else toast.success(`${strings.opsLetterSent} ${result.sent}`);
                });
              }}
            >
              {strings.opsLetterTest}
            </Button>
            <Button
              type="button"
              onClick={() => {
                void sendLetterIssue({ data: { testOnly: false } }).then((result) => {
                  if (result.error && !result.sent) toast.error(result.error);
                  else toast.success(`${strings.opsLetterSent} ${result.sent}`);
                });
              }}
            >
              {strings.opsLetterSend}
            </Button>
          </div>
          {filteredLetter.length === 0 ? (
            <EmptyState title={strings.opsLetterEmpty} />
          ) : (
            <div className="overflow-x-auto rounded-3xl bg-card shadow-border">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead className="text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">{strings.email}</th>
                    <th className="px-5 py-3 font-medium">{strings.opsLetterLocale}</th>
                    <th className="px-5 py-3 font-medium">{strings.opsLetterCity}</th>
                    <th className="px-5 py-3 font-medium">{strings.opsLetterStatus}</th>
                    <th className="px-5 py-3 font-medium">{strings.opsLetterCreated}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLetter.map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <td className="px-5 py-3 font-mono text-xs text-fg">{row.email}</td>
                      <td className="px-5 py-3 text-muted">{row.locale}</td>
                      <td className="px-5 py-3 text-muted">{row.citySlug ?? "—"}</td>
                      <td className="px-5 py-3">
                        <Badge variant={row.status === "active" ? "ok" : "muted"}>{row.status}</Badge>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted">
                        {row.createdAt.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {gate === "admin" && tab === "mail" && smtp ? (
        <form onSubmit={(event) => void save(event)} className="max-w-xl space-y-4">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={smtp.enabled}
              onChange={(event) => setSmtp({ ...smtp, enabled: event.target.checked })}
            />
            {strings.smtpEnabled}
          </label>
          <Field label={strings.smtpHost}>
            <input
              className={fieldClass}
              value={smtp.host}
              placeholder="smtp.resend.com"
              onChange={(event) => setSmtp({ ...smtp, host: event.target.value })}
            />
          </Field>
          <Field label={strings.smtpPort}>
            <input
              className={fieldClass}
              type="number"
              value={smtp.port}
              onChange={(event) => setSmtp({ ...smtp, port: Number(event.target.value) || 465 })}
            />
          </Field>
          <Field label={strings.smtpUsername}>
            <input
              className={fieldClass}
              value={smtp.username}
              autoComplete="off"
              onChange={(event) => setSmtp({ ...smtp, username: event.target.value })}
            />
          </Field>
          <Field label={strings.smtpPassword}>
            <input
              className={fieldClass}
              type="password"
              autoComplete="new-password"
              placeholder={smtp.hasPassword ? strings.smtpPasswordKept : ""}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <Field label={strings.smtpFromName}>
            <input
              className={fieldClass}
              value={smtp.fromName}
              onChange={(event) => setSmtp({ ...smtp, fromName: event.target.value })}
            />
          </Field>
          <Field label={strings.smtpFromEmail}>
            <input
              className={fieldClass}
              type="email"
              value={smtp.fromEmail}
              placeholder="hello@yourdomain.com"
              onChange={(event) => setSmtp({ ...smtp, fromEmail: event.target.value })}
            />
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={smtp.secure}
              onChange={(event) => setSmtp({ ...smtp, secure: event.target.checked })}
            />
            {strings.smtpSecure}
          </label>
          <p className="text-xs leading-relaxed text-muted">{strings.smtpHint}</p>
          <Button type="submit" disabled={saving}>
            {saving ? strings.working : strings.save}
          </Button>
          <div className="border-t border-line pt-6">
            <p className="text-sm font-medium">{strings.smtpTest}</p>
            <div className="mt-3 flex gap-2">
              <input
                className={fieldClass}
                type="email"
                value={testTo}
                placeholder={user.primaryEmail ?? strings.email}
                onChange={(event) => setTestTo(event.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void sendTestEmail({ data: { to: testTo || user.primaryEmail || "" } }).then((result) => {
                    if (result.sent) toast.success(strings.letterSent);
                    else toast.error(result.error ?? strings.authFailed);
                  });
                }}
              >
                {strings.send}
              </Button>
            </div>
          </div>
        </form>
      ) : null}

      {gate === "admin" && tab === "pay" ? <PaymentDesk /> : null}

      {gate === "admin" && tab === "members" ? (
        members.length === 0 ? (
          <p className="text-sm text-muted">{strings.opsNoMembers}</p>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-card shadow-border">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">{strings.name}</th>
                  <th className="px-5 py-3 font-medium">{strings.email}</th>
                  <th className="px-5 py-3 font-medium">{strings.passTitle}</th>
                  <th className="px-5 py-3 font-medium">{strings.opsJoined}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-line">
                    <td className="px-5 py-3 text-fg">{member.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">
                      {member.email}
                      {member.verified ? "" : ` · ${strings.opsUnverified}`}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {member.passStatus === "active" ? strings.passActive : strings.passInactive}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">
                      {member.createdAt.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </DeskFrame>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-card/40 px-6 py-16 text-center">
      <p className="text-sm text-muted">{title}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}
