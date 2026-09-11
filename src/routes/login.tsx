import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LanguageToggle } from "@/components/site/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { t, useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [{ title: `Sign in · ${SITE.name}` }],
  }),
});

function Login() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const navigate = useNavigate();
  const { user, isPending: sessionPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  if (!sessionPending && user) {
    return <Navigate to="/pass" />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!authEnabled) return;
    setPending(true);
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
        });
        if (error) {
          toast.error(error.message ?? strings.authFailed);
          return;
        }
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
          toast.error(error.message ?? strings.authFailed);
          return;
        }
      }
      await authClient.getSession().catch(() => undefined);
      toast.success(mode === "signup" ? strings.welcomeNew : strings.welcomeBack);
      void navigate({ to: "/pass" });
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
        <p className="kicker text-accent">{strings.authKicker}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">
          {mode === "signup" ? strings.signUp : strings.signIn}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{strings.authDek}</p>

        {authEnabled ? (
          <>
            <div className="mt-8 flex flex-col gap-2">
              {GROK_PROVIDERS.map((provider) => (
                <Button
                  key={provider.providerId}
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => void signIn(provider.providerId, { callbackURL: "/pass" })}
                >
                  {strings.continueWith} {provider.label}
                </Button>
              ))}
            </div>

            <p className="my-6 text-center font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              {strings.orEmail}
            </p>

            <form onSubmit={(event) => void submit(event)} className="space-y-3">
              {mode === "signup" ? (
                <label className="block">
                  <span className="sr-only">{strings.name}</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={strings.name}
                    className="h-12 w-full rounded-full bg-void-elevated px-5 text-base text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover"
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
                  className="h-12 w-full rounded-full bg-void-elevated px-5 text-base text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover"
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
                  className="h-12 w-full rounded-full bg-void-elevated px-5 text-base text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover"
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
      </div>
    </main>
  );
}
