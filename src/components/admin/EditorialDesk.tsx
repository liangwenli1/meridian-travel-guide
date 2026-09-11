import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { type Dispatch, type DispatchTier } from "@/data/dispatches";
import { PUBLISHED_GUIDE_SLUGS } from "@/data/guides";
import { GUIDE_NAV } from "@/lib/guide-nav";
import { t, useI18n } from "@/lib/i18n";
import {
  deleteDispatch,
  listChapterEdits,
  listLiveDispatches,
  saveChapterEdit,
  saveDispatch,
  type ChapterEdit,
} from "@/lib/server/editorial";

const emptyDispatch = (): Dispatch => ({
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  kicker: { en: "", zh: "" },
  title: { en: "", zh: "" },
  dek: { en: "", zh: "" },
  body: { en: "", zh: "" },
  tier: "letter-free",
});

export function DispatchEditor() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [rows, setRows] = useState<Dispatch[]>([]);
  const [draft, setDraft] = useState<Dispatch>(emptyDispatch());
  const [saving, setSaving] = useState(false);

  const reload = () => listLiveDispatches().then(setRows).catch(() => setRows([]));

  useEffect(() => {
    void reload();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveDispatch({ data: draft });
      toast.success(strings.saved);
      setDraft(emptyDispatch());
      await reload();
    } catch {
      toast.error(strings.authFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={(event) => void submit(event)} className="space-y-3 rounded-3xl bg-card p-5 shadow-border">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>{strings.opsDispatchTitle} (slug)</Label>
            <Input className="mt-1" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} required />
          </div>
          <div>
            <Label>{strings.opsDispatchDate}</Label>
            <Input className="mt-1" type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Title EN</Label>
            <Input className="mt-1" value={draft.title.en} onChange={(e) => setDraft({ ...draft, title: { ...draft.title, en: e.target.value } })} required />
          </div>
          <div>
            <Label>Title 中文</Label>
            <Input className="mt-1" value={draft.title.zh} onChange={(e) => setDraft({ ...draft, title: { ...draft.title, zh: e.target.value } })} />
          </div>
        </div>
        <div>
          <Label>Dek EN</Label>
          <Textarea className="mt-1" value={draft.dek.en} onChange={(e) => setDraft({ ...draft, dek: { ...draft.dek, en: e.target.value } })} />
        </div>
        <div>
          <Label>Body EN</Label>
          <Textarea className="mt-1 min-h-40" value={draft.body.en} onChange={(e) => setDraft({ ...draft, body: { ...draft.body, en: e.target.value } })} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="h-11 rounded-2xl bg-void-elevated px-3 text-sm shadow-border"
            value={draft.tier}
            onChange={(e) => setDraft({ ...draft, tier: e.target.value as DispatchTier })}
          >
            <option value="letter-free">{strings.deskLetterFree}</option>
            <option value="pass-briefing">{strings.deskPassOnly}</option>
          </select>
          <Button type="submit" disabled={saving}>
            {saving ? strings.working : strings.save}
          </Button>
        </div>
      </form>

      <ul className="divide-y divide-line overflow-hidden rounded-3xl bg-card shadow-border">
        {rows.map((row) => (
          <li key={row.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-medium">{row.title.en}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {row.date} · {row.slug}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={row.tier === "pass-briefing" ? "accent" : "muted"}>
                {row.tier === "pass-briefing" ? strings.deskPassOnly : strings.deskLetterFree}
              </Badge>
              <Button type="button" size="sm" variant="outline" onClick={() => setDraft(row)}>
                {strings.edit}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  void deleteDispatch({ data: { slug: row.slug } })
                    .then(() => reload())
                    .catch(() => toast.error(strings.authFailed));
                }}
              >
                {strings.delete}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChapterEditor() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [citySlug, setCitySlug] = useState(PUBLISHED_GUIDE_SLUGS[0] ?? "tokyo");
  const [chapter, setChapter] = useState<(typeof GUIDE_NAV)[number]["id"]>("overview");
  const [editLocale, setEditLocale] = useState<"en" | "zh">("en");
  const [markdown, setMarkdown] = useState("");
  const [rows, setRows] = useState<ChapterEdit[]>([]);
  const [saving, setSaving] = useState(false);

  const reload = () => listChapterEdits().then(setRows).catch(() => setRows([]));

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    const found = rows.find((row) => row.citySlug === citySlug && row.chapter === chapter && row.locale === editLocale);
    setMarkdown(found?.markdown ?? "");
  }, [citySlug, chapter, editLocale, rows]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{strings.chapterEditorDek}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <select className="h-11 rounded-2xl bg-void-elevated px-3 text-sm shadow-border" value={citySlug} onChange={(e) => setCitySlug(e.target.value)}>
          {PUBLISHED_GUIDE_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>
        <select
          className="h-11 rounded-2xl bg-void-elevated px-3 text-sm shadow-border"
          value={chapter}
          onChange={(e) => setChapter(e.target.value as (typeof GUIDE_NAV)[number]["id"])}
        >
          {GUIDE_NAV.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          className="h-11 rounded-2xl bg-void-elevated px-3 text-sm shadow-border"
          value={editLocale}
          onChange={(e) => setEditLocale(e.target.value === "zh" ? "zh" : "en")}
        >
          <option value="en">EN</option>
          <option value="zh">中文</option>
        </select>
      </div>
      <Textarea className="min-h-48" value={markdown} onChange={(e) => setMarkdown(e.target.value)} />
      <Button
        type="button"
        disabled={saving}
        onClick={() => {
          setSaving(true);
          void saveChapterEdit({ data: { citySlug, chapter, locale: editLocale, markdown } })
            .then(() => {
              toast.success(strings.saved);
              return reload();
            })
            .catch(() => toast.error(strings.authFailed))
            .finally(() => setSaving(false));
        }}
      >
        {saving ? strings.working : strings.save}
      </Button>
    </div>
  );
}
