import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({
  caption,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { caption?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl bg-card shadow-border", className)} {...props}>
      {caption ? <p className="kicker px-4 py-3 text-muted">{caption}</p> : null}
      <table className="min-w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="kicker text-muted">{children}</thead>;
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-2.5 font-medium", className)} {...props} />;
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-t border-line align-top", className)} {...props} />;
}

export function Td({
  muted,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { muted?: boolean }) {
  return <td className={cn("px-4 py-3", muted && "text-muted", className)} {...props} />;
}
