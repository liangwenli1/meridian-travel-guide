import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/Button";
import { t, useI18n } from "@/lib/i18n";
import { sendFeedback } from "@/lib/server/feedback";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
  head: () => ({
    meta: [{ title: `Feedback · ${SITE.name}` }],
  }),
});

const fieldClass =
  "h-12 w-full rounded-2xl bg-void-elevated px-4 text-sm text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover";

function FeedbackPage() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      const result = await sendFeedback({ data: { name, email, message } });
      if (!result.ok) {
        toast.error(
          result.error === "short"
            ? strings.feedbackShort
            : result.error === "inbox" || result.error === "smtp-not-ready"
              ? strings.smtpNotReady
              : strings.letterInvalid,
        );
        return;
      }
      setSent(true);
      toast.success(strings.feedbackThanks);
    } catch {
      toast.error(strings.authFailed);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-dvh bg-void text-fg">
      <SiteHeader />
      <div className="mx-auto max-w-lg px-6 py-16 md:py-24">
        <p className="kicker text-accent">{strings.feedbackKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{strings.feedbackTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{strings.feedbackDek}</p>

        {sent ? (
          <p className="mt-10 text-sm text-fg">{strings.feedbackThanks}</p>
        ) : (
          <form onSubmit={(event) => void submit(event)} className="mt-10 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{strings.name}</span>
              <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{strings.email}</span>
              <input
                className={fieldClass}
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{strings.feedbackMessage}</span>
              <textarea
                className={`${fieldClass} h-40 py-3`}
                required
                minLength={8}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? strings.working : strings.feedbackSend}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
