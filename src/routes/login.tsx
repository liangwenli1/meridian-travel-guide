import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { authClient, authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { getVerifyState, resendSignup, startSignup } from "@/lib/server/email-verify";
import { SITE } from "@/lib/site";

type Search = { registered?: boolean };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    registered: search.registered === "1" || search.registered === true,
  }),
  component: Login,
  head: () => ({
    meta: [{ title: `Sign in · ${SITE.name}` }],
  }),
});

const fieldClass =
  "h-12 w-full rounded-full bg-void-elevated px-5 text-base text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover";

function Login() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const navigate = useNavigate();
  const { registered } = Route.useSearch();
  const { user, isPending: sessionPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [checkEmail, setCheckEmail] = useState<string | null>(null);

  useEffect(() => {
    if (registered) toast.success(strings.registeredNow);
  }, [registered, strings.registeredNow]);

  if (!sessionPending && user && !checkEmail) {
    return <Navigate to="/" />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!authEnabled) return;
    setPending(true);
    try {
      if (mode === "signup") {
        const result = await startSignup({
          data: { email, password, name: name.trim() || email.split("@")[0] },
        });
        if (!result.ok) {
          const message =
            result.error === "already-registered"
              ? strings.alreadyRegistered
              : result.error === "smtp-not-ready"
                ? strings.smtpNotReady
                : result.error === "invalid"
                  ? strings.authFailed
                  : result.error;
          toast.error(message);
          return;
        }
        if ("bootstrap" in result && result.bootstrap) {
          toast.success(strings.bootstrapReady);
          setMode("signin");
          return;
        }
        setCheckEmail(email.trim().toLowerCase());
        return;
      }

      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        toast.error(error.message ?? strings.authFailed);
        return;
      }
      const state = await getVerifyState().catch(() => ({ verified: false, email: null }));
      if (!state.verified) {
        toast.error(strings.pleaseVerify);
        await signOut("/login");
        return;
      }
      toast.success(strings.welcomeBack);
      void navigate({ to: "/" });
    } catch (error) {
      const message = error instanceof Error ? error.message : strings.authFailed;
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  const resend = async () => {
    if (!checkEmail) return;
    setPending(true);
    try {
      const result = await resendSignup({ data: { email: checkEmail } });
      if (!result.ok) {
        toast.error(result.error === "smtp-not-ready" ? strings.smtpNotReady : result.error);
        return;
      }
      toast.success(strings.letterSent);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="relative min-h-dvh bg-void text-fg">
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="text-xl font-medium tracking-tight">
          {SITE.name}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link to="/" className="text-sm text-muted hover:text-fg">
            {strings.globe}
          </Link>
        </div>
      </header>
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-md flex-col justify-center px-6 pb-16">
        {checkEmail ? (
          <>
            <p className="kicker text-accent">{strings.authKicker}</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight">{strings.checkEmailTitle}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {strings.checkEmailDek} <span className="text-fg">{checkEmail}</span>
            </p>
            <Button
              type="button"
              size="lg"
              className="mt-8 w-full"
              disabled={pending}
              onClick={() => void resend()}
            >
              {pending ? strings.working : strings.resendLetter}
            </Button>
            <button
              type="button"
              className="mt-6 text-sm text-muted hover:text-fg"
              onClick={() => {
                setCheckEmail(null);
                setMode("signin");
              }}
            >
              {strings.haveAccount}
            </button>
          </>
        ) : (
          <>
            <p className="kicker text-accent">{strings.authKicker}</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight">
              {mode === "signup" ? strings.signUp : strings.signIn}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{strings.authDek}</p>

            {authEnabled ? (
              <>
                <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-3">
                  {mode === "signup" ? (
                    <label className="block">
                      <span className="sr-only">{strings.name}</span>
                      <input
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={strings.name}
                        className={fieldClass}
                      />
                    </label>
                  ) : null}
                  <label className="block">
                    <span className="sr-only">{strings.email}</span>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={strings.email}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">{strings.password}</span>
                    <input
                      type="password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={strings.password}
                      className={fieldClass}
                    />
                    {mode === "signup" ? (
                      <span className="mt-2 block px-5 text-xs text-muted">{strings.passwordHint}</span>
                    ) : null}
                  </label>
                  <Button type="submit" size="lg" className="w-full" disabled={pending}>
                    {pending
                      ? strings.working
                      : mode === "signup"
                        ? strings.createAccount
                        : strings.signIn}
                  </Button>
                </form>

                <button
                  type="button"
                  className="mt-6 text-sm text-muted hover:text-fg"
                  onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                >
                  {mode === "signup" ? strings.haveAccount : strings.needAccount}
                </button>
              </>
            ) : (
              <p className="mt-8 text-sm text-muted">{strings.authDisabled}</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
