import { useEffect } from "react";
import { detectLocale, useI18n, type Locale } from "@/lib/i18n";

function syncDocumentLang(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}

export function LocaleBootstrap() {
  useEffect(() => {
    const apply = () => {
      const state = useI18n.getState();
      if (!state.chosen) state.applyDetected(detectLocale());
      syncDocumentLang(useI18n.getState().locale);
    };

    const unsubHydrate = useI18n.persist.onFinishHydration(apply);
    if (useI18n.persist.hasHydrated()) apply();
    const unsub = useI18n.subscribe((state) => syncDocumentLang(state.locale));
    return () => {
      unsubHydrate();
      unsub();
    };
  }, []);

  return null;
}
