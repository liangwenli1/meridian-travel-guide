import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { recordIntent } from "@/lib/server/catalog";
import { t, useI18n } from "@/lib/i18n";

const STORAGE_KEY = "meridian-letter";

export function LetterForm({ citySlug, compact = false }: { citySlug?: string; compact?: boolean }) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") setDone(true);
    } catch {
      /* ignore */
    }
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@") || email.length < 5) {
      toast.error(strings.letterInvalid);
      return;
    }
    setPending(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
      await recordIntent({ data: { kind: "letter", citySlug: citySlug ?? null } }).catch(() => undefined);
      setDone(true);
      toast.success(strings.letterThanks);
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return <p className="text-sm text-muted">{strings.letterThanks}</p>;
  }

  return (
    <form onSubmit={(event) => void submit(event)} className={compact ? "flex w-full max-w-md gap-2" : "flex w-full max-w-lg gap-2"}>
      <label className="sr-only" htmlFor="letter-email">
        {strings.letterPlaceholder}
      </label>
      <input
        id="letter-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={strings.letterPlaceholder}
        className="h-12 min-w-0 flex-1 rounded-full bg-void-elevated px-5 text-base text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover"
      />
      <Button type="submit" size="lg" disabled={pending}>
        {strings.letterCta}
      </Button>
    </form>
  );
}
