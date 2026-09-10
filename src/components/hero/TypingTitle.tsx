import { useEffect, useState } from "react";
import { randBetween } from "@/lib/motion";

const REST = "do you want to go";

type Phase = "typing" | "blink" | "hold" | "deleting";

type TypingTitleProps = {
  reducedMotion: boolean;
  ready: boolean;
};

export function TypingTitle({ reducedMotion, ready }: TypingTitleProps) {
  const [rest, setRest] = useState(reducedMotion ? REST : "");
  const [showMark, setShowMark] = useState(reducedMotion);
  const [markOpaque, setMarkOpaque] = useState(true);
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    if (!ready || reducedMotion) {
      setRest(REST);
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
          while (index < REST.length && !cancelled) {
            index += 1;
            setRest(REST.slice(0, index));
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
            setRest(REST.slice(0, index));
            await wait(randBetween(35, 70));
          }
          if (cancelled) return;
          await wait(randBetween(280, 480));
          phase = "typing";
        }
      }
    };

    void run();
    const caretTimer = window.setInterval(() => {
      setCaret((value) => !value);
    }, 530);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearInterval(caretTimer);
    };
  }, [ready, reducedMotion]);

  return (
    <h1 className="max-w-[16ch] text-center leading-[0.95] tracking-[-0.04em] md:max-w-none">
      <span className="text-[18vw] font-medium tracking-tight text-accent sm:text-8xl md:text-[7.2rem]">
        Where
      </span>
      <span className="mt-2 block text-[6.6vw] font-normal text-fg sm:text-3xl md:mt-3 md:text-[2.2rem]">
        {rest}
        {showMark ? (
          <span className={markOpaque ? "text-accent" : "text-accent/20"}>?</span>
        ) : null}
        {!reducedMotion ? (
          <span
            aria-hidden="true"
            className={`ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.08em] bg-accent ${
              caret ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
      </span>
    </h1>
  );
}
