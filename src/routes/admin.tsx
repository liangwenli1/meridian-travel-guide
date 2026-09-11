import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { PaymentDesk } from "@/components/admin/PaymentDesk";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { sendTestEmail } from "@/lib/server/email-verify";
import {
  claimAdmin,
  getAdminState,
  getSmtpSettings,
  saveSmtpSettings,
  type SmtpPublic,
} from "@/lib/server/ops";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: `Desk · ${SITE.name}` }],
  }),
});

const fieldClass =
  "h-12 w-full rounded-2xl bg-void-elevated px-4 text-sm text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover";

function AdminPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const [gate, setGate] = useState<"load" | "claim" | "admin" | "denied">("load");
  const [tab, setTab] = useState<"mail" | "pay">("mail");
  const [smtp, setSmtp] = useState<SmtpPublic | null>(null);
  const [password, setPassword] = useState("");
  const [testTo, setTestTo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending || !userId) return;
    void getAdminState()
      .then((state) => {
        if (state.isAdmin) {
          setGate("admin");
          return getSmtpSettings().then(setSmtp);
        }
        setGate(state.canClaim ? "claim" : "denied");
      })
      .catch(() => setGate("denied"));
  }, [isPending, userId]);

  if (isPending) {
    return (
      <main className="min-h-dvh bg-void text-fg">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-6 py-24">
          <div className="h-10 w-40 animate-pulse rounded bg-void-elevated" />
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
    } catch {
      toast.error(strings.authFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
        <p className="kicker text-accent">{strings.adminKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{strings.adminTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{strings.adminDek}</p>

        {gate === "claim" ? (
          <Button
            className="mt-8"
            size="lg"
            onClick={() => {
              void claimAdmin()
                .then((state) => {
                  if (!state.isAdmin) return;
                  setGate("admin");
                  return getSmtpSettings().then(setSmtp);
                })
                .catch(() => toast.error(strings.authFailed));
            }}
          >
            {strings.claimAdmin}
          </Button>
        ) : null}

        {gate === "denied" ? <p className="mt-8 text-sm text-muted">{strings.adminDenied}</p> : null}

        {gate === "admin" ? (
          <div className="mt-8 flex gap-2">
            <Button type="button" variant={tab === "mail" ? "default" : "outline"} onClick={() => setTab("mail")}>
              {strings.tabMail}
            </Button>
            <Button type="button" variant={tab === "pay" ? "default" : "outline"} onClick={() => setTab("pay")}>
              {strings.tabPay}
            </Button>
          </div>
        ) : null}

        {gate === "admin" && tab === "mail" && smtp ? (
          <form onSubmit={(event) => void save(event)} className="mt-10 space-y-4">
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
                placeholder="smtp.example.com"
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

        <p className="mt-12">
          <Link to="/account" className="text-sm text-muted hover:text-fg">
            {strings.account}
          </Link>
        </p>
      </div>
    </main>
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
