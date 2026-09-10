import { useEffect, useState } from "react";
import { t, useI18n } from "@/lib/i18n";
import { randBetween } from "@/lib/motion";

type Phase = "typing" | "blink" | "hold" | "deleting";

type TypingTitleProps = {
  reducedMotion: boolean;
  ready: boolean;
};

export function TypingTitle({ reducedMotion, ready }: TypingTitleProps) {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const restFull = strings.rest;
  const [rest, setRest] = useState(reducedMotion ? restFull : "");
  const [showMark, setShowMark] = useState(reducedMotion);
  const [markOpaque, setMarkOpaque] = useState(true);
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    if (!ready || reducedMotion) {
      setRest(restFull);
      setShowMark(true);
      setMarkOpaque(true);
      return;
    }

    let cancelled = false;
    let timer = 0;
    let phase: Phase = "typing";
    let index = 0;
    let blinks = 0;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    const run = async () => {
      while (!cancelled) {
        if (phase === "typing") {
          setShowMark(false);
          setMarkOpaque(true);
          while (index < restFull.length && !cancelled) {
            index += 1;
            setRest(restFull.slice(0, index));
            await wait(randBetween(70, 120));
          }
          if (cancelled) return;
          setShowMark(true);
          phase = "blink";
          blinks = 0;
        } else if (phase === "blink") {
          const slice = randBetween(200, 320);
          setMarkOpaque(false);
          await wait(slice);
          if (cancelled) return;
          setMarkOpaque(true);
          await wait(slice);
          if (cancelled) return;
          blinks += 1;
          if (blinks >= 2) phase = "hold";
        } else if (phase === "hold") {
          await wait(randBetween(1000, 1800));
          if (cancelled) return;
          phase = "deleting";
        } else {
          setShowMark(false);
          while (index > 0 && !cancelled) {
            index -= 1;
            setRest(restFull.slice(0, index));
            await wait(randBetween(35, 70));
          }
          if (cancelled) return;
          await wait(randBetween(280, 480));
          phase = "typing";
        }
      }
    };

    setRest("");
    void run();
    const caretTimer = window.setInterval(() => {
      setCaret((value) => !value);
    }, 530);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearInterval(caretTimer);
    };
  }, [ready, reducedMotion, restFull, locale]);

  return (
    <h1 className="max-w-[16ch] text-center leading-[0.95] tracking-[-0.04em] md:max-w-none">
      <span className="text-[18vw] font-medium tracking-tight text-accent sm:text-8xl md:text-[7.2rem]">
        {strings.where}
      </span>
      <span className="mt-2 block text-[6.6vw] font-normal text-fg sm:text-3xl md:mt-3 md:text-[2.2rem]">
        {rest}
        {showMark ? (
          <span className={markOpaque ? "text-accent" : "text-accent/20"}>{locale === "zh" ? "？" : "?"}</span>
        ) : null}
        {!reducedMotion ? (
          <span
            aria-hidden="true"
            className={`ml-0.5 inline-block h-[0.9em] w-0.5 translate-y-[0.08em] bg-accent ${
              caret ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
      </span>
    </h1>
  );
}
