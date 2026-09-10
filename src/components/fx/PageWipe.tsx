import { cn } from "@/lib/utils";

export function PageWipe({
  dir,
  on,
}: {
  dir: 1 | -1;
  on: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("page-wipe", on && (dir === 1 ? "page-wipe-down" : "page-wipe-up"))}
    />
  );
}
