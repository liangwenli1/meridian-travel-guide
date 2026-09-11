import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { PaymentDesk } from "@/components/admin/PaymentDesk";
import { DeskFrame, DeskStat } from "@/components/desk/DeskFrame";
import { Button } from "@/components/ui/Button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { sendTestEmail } from "@/lib/server/email-verify";
import { getOpsOverview, listMembers, type MemberRow, type OpsOverview } from "@/lib/server/desk";
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
    meta: [{ title: `Operations · ${SITE.name}` }],
  }),
});

const fieldClass =
  "h-12 w-full rounded-2xl bg-void-elevated px-4 text-sm text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover";

type Tab = "overview" | "mail" | "pay" | "members";

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

  useEffect(() => {
    if (isPending || !userId) return;
    void getAdminState()
      .then((state) => {
        if (state.isAdmin) {
          setGate("admin");
          return Promise.all([
            getSmtpSettings().then(setSmtp),
            getOpsOverview().then(setOverview),
            listMembers().then(setMembers),
          ]);
        }
        setGate(state.canClaim ? "claim" : "denied");
      })
      .catch(() => setGate("denied"));
  }, [isPending, userId]);

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

  return (
    <DeskFrame
      tone="ops"
      kicker={strings.opsKicker}
      title={strings.opsTitle}
      dek={strings.opsDek}
      nav={[
        { label: strings.opsOverview, current: tab === "overview", onClick: () => setTab("overview") },
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
                return Promise.all([
                  getSmtpSettings().then(setSmtp),
                  getOpsOverview().then(setOverview),
                  listMembers().then(setMembers),
                ]);
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}
