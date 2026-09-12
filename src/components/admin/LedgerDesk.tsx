import { useEffect, useState } from "react";
import { Receipt, Search, Ticket, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import { t, useI18n } from "@/lib/i18n";
import {
  cancelOpsOrder,
  listMembers,
  listOpsOrders,
  listPasses,
  setPass,
  type MemberRow,
  type OpsOrder,
  type PassRow,
} from "@/lib/server/desk";
import { markOrderPaid } from "@/lib/server/payment/service";

function statusBadge(status: string) {
  if (status === "active" || status === "COMPLETED") return "ok" as const;
  if (status === "PENDING") return "warn" as const;
  if (status === "cancelled" || status === "CANCELLED" || status === "FAILED") return "muted" as const;
  return "accent" as const;
}

function Chip({
  current,
  onClick,
  children,
}: {
  current: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <Button type="button" size="sm" variant={current ? "default" : "outline"} onClick={onClick}>
      {children}
    </Button>
  );
}

export function UsersDesk() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = (q = query) =>
    listMembers({ data: { query: q } })
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    void reload("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = (userId: string, action: string, plan?: string, days?: number) =>
    setPass({ data: { userId, action, plan, days } })
      .then(() => {
        toast.success(strings.saved);
        return reload();
      })
      .catch(() => toast.error(strings.authFailed));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search className="pointer-events-none absolute top-3.5 left-4 size-4 text-muted" />
          <Input
            className="pl-11"
            placeholder={strings.opsUserSearch}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void reload(query);
            }}
          />
        </div>
        <Button type="button" variant="outline" onClick={() => void reload(query)}>
          {strings.opsSearch}
        </Button>
      </div>
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-void-elevated" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted">{strings.opsNoMembers}</p>
      ) : (
        <Table caption={`${rows.length} · ${strings.opsUsers}`}>
          <THead>
            <Tr>
              <Th>{strings.name}</Th>
              <Th>{strings.email}</Th>
              <Th>{strings.passTitle}</Th>
              <Th>{strings.opsJoined}</Th>
              <Th />
            </Tr>
          </THead>
          <tbody>
            {rows.map((row) => (
              <Tr key={row.id}>
                <Td>
                  <p className="font-medium">{row.name || "—"}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {row.isAdmin ? strings.opsRoleAdmin : strings.opsRoleUser}
                    {row.orderCount ? ` · ${row.orderCount}` : ""}
                  </p>
                </Td>
                <Td muted>
                  <span className="font-mono text-xs">{row.email}</span>
                  {row.verified ? null : ` · ${strings.opsUnverified}`}
                </Td>
                <Td>
                  <Badge variant={statusBadge(row.passStatus === "active" ? "active" : "cancelled")}>
                    {row.passStatus === "active"
                      ? row.passPlan === "max"
                        ? strings.planMax
                        : strings.planPro
                      : strings.planFree}
                  </Badge>
                  {row.passExpires ? (
                    <p className="mt-1 font-mono text-xs text-muted">{row.passExpires.slice(0, 10)}</p>
                  ) : null}
                </Td>
                <Td muted className="font-mono text-xs">
                  {row.createdAt.slice(0, 10)}
                </Td>
                <Td>
                  <div className="flex flex-wrap justify-end gap-1">
                    <Button type="button" size="sm" variant="outline" onClick={() => void act(row.id, "grant", "pro", 365)}>
                      Pro
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => void act(row.id, "grant", "max", 365)}>
                      Max
                    </Button>
                    {row.passStatus === "active" ? (
                      <Button type="button" size="sm" variant="ghost" onClick={() => void act(row.id, "revoke")}>
                        {strings.opsRevoke}
                      </Button>
                    ) : null}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export function PassesDesk() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<PassRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = (next = status) =>
    listPasses({ data: { status: next } })
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    void reload("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = (userId: string, action: string, plan?: string, days?: number) =>
    setPass({ data: { userId, action, plan, days } })
      .then(() => {
        toast.success(strings.saved);
        return reload();
      })
      .catch(() => toast.error(strings.authFailed));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{strings.opsPassDek}</p>
      <div className="flex flex-wrap gap-2">
        <Chip current={status === "all"} onClick={() => { setStatus("all"); void reload("all"); }}>
          {strings.opsFilterAll}
        </Chip>
        <Chip current={status === "active"} onClick={() => { setStatus("active"); void reload("active"); }}>
          {strings.opsFilterActive}
        </Chip>
        <Chip current={status === "cancelled"} onClick={() => { setStatus("cancelled"); void reload("cancelled"); }}>
          {strings.opsRevoked}
        </Chip>
      </div>
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-void-elevated" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted">{strings.opsNoPasses}</p>
      ) : (
        <Table caption={`${rows.length} · ${strings.opsPassTab}`}>
          <THead>
            <Tr>
              <Th>{strings.email}</Th>
              <Th>{strings.passTitle}</Th>
              <Th>{strings.opsPassStart}</Th>
              <Th>{strings.opsPassUntil}</Th>
              <Th />
            </Tr>
          </THead>
          <tbody>
            {rows.map((row) => (
              <Tr key={row.userId}>
                <Td>
                  <p className="font-medium">{row.name || row.email}</p>
                  <p className="mt-1 font-mono text-xs text-muted">{row.email}</p>
                </Td>
                <Td>
                  <Badge variant={statusBadge(row.status)}>
                    {row.plan === "max" ? strings.planMax : strings.planPro} · {row.status}
                  </Badge>
                </Td>
                <Td muted className="font-mono text-xs">
                  {row.startedAt.slice(0, 10)}
                </Td>
                <Td muted className="font-mono text-xs">
                  {row.expiresAt ? row.expiresAt.slice(0, 10) : "—"}
                </Td>
                <Td>
                  <div className="flex flex-wrap justify-end gap-1">
                    <Button type="button" size="sm" variant="outline" onClick={() => void act(row.userId, "extend", row.plan, 30)}>
                      +30
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => void act(row.userId, "extend", row.plan, 365)}>
                      +365
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => void act(row.userId, "grant", "max", 365)}>
                      Max
                    </Button>
                    {row.status === "active" ? (
                      <Button type="button" size="sm" variant="ghost" onClick={() => void act(row.userId, "revoke")}>
                        {strings.opsRevoke}
                      </Button>
                    ) : (
                      <Button type="button" size="sm" variant="outline" onClick={() => void act(row.userId, "grant", row.plan === "max" ? "max" : "pro", 365)}>
                        {strings.opsRestore}
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export function OrdersDesk() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<OpsOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = (nextStatus = status, nextQuery = query) =>
    listOpsOrders({ data: { status: nextStatus, query: nextQuery } })
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    void reload("all", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paid = (outTradeNo: string) =>
    markOrderPaid({ data: { outTradeNo } })
      .then(() => {
        toast.success(strings.payDone);
        return reload();
      })
      .catch(() => toast.error(strings.authFailed));

  const cancel = (outTradeNo: string, refund: boolean) =>
    cancelOpsOrder({ data: { outTradeNo, refund } })
      .then(() => {
        toast.success(strings.saved);
        return reload();
      })
      .catch(() => toast.error(strings.authFailed));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{strings.opsOrderDek}</p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Receipt className="pointer-events-none absolute top-3.5 left-4 size-4 text-muted" />
          <Input
            className="pl-11"
            placeholder={strings.opsOrderSearch}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void reload(status, query);
            }}
          />
        </div>
        <Button type="button" variant="outline" onClick={() => void reload(status, query)}>
          {strings.opsSearch}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", "PENDING", "COMPLETED", "CANCELLED"] as const).map((id) => (
          <Chip
            key={id}
            current={status === id}
            onClick={() => {
              setStatus(id);
              void reload(id, query);
            }}
          >
            {id === "all" ? strings.opsFilterAll : id === "PENDING" ? strings.opsPending : id === "COMPLETED" ? strings.opsPaid : strings.opsCancelled}
          </Chip>
        ))}
      </div>
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-void-elevated" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted">{strings.payNoOrders}</p>
      ) : (
        <Table caption={`${rows.length} · ${strings.opsOrderTab}`}>
          <THead>
            <Tr>
              <Th>{strings.opsOrderNo}</Th>
              <Th>{strings.email}</Th>
              <Th>{strings.opsAmount}</Th>
              <Th>{strings.opsStatusCol}</Th>
              <Th>{strings.opsJoined}</Th>
              <Th />
            </Tr>
          </THead>
          <tbody>
            {rows.map((row) => (
              <Tr key={row.id}>
                <Td>
                  <p className="font-mono text-xs">{row.outTradeNo}</p>
                  <p className="mt-1 text-xs text-muted">
                    {row.method} · {row.product}
                  </p>
                </Td>
                <Td muted>
                  <span className="font-mono text-xs">{row.email || row.userId.slice(0, 8)}</span>
                </Td>
                <Td>
                  {row.currency} {row.amount}
                </Td>
                <Td>
                  <Badge variant={statusBadge(row.status)}>{row.status}</Badge>
                </Td>
                <Td muted className="font-mono text-xs">
                  {row.createdAt.slice(0, 16).replace("T", " ")}
                </Td>
                <Td>
                  <div className="flex flex-wrap justify-end gap-1">
                    {row.status === "PENDING" ? (
                      <>
                        <Button type="button" size="sm" onClick={() => void paid(row.outTradeNo)}>
                          {strings.payMarkPaid}
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => void cancel(row.outTradeNo, false)}>
                          {strings.opsCancelOrder}
                        </Button>
                      </>
                    ) : null}
                    {row.status === "COMPLETED" ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => void cancel(row.outTradeNo, true)}>
                        {strings.opsMarkRefund}
                      </Button>
                    ) : null}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export const ledgerIcons = { Users, Ticket, Receipt };
