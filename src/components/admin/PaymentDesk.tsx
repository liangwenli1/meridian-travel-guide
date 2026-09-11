import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { t, useI18n } from "@/lib/i18n";
import {
  getPaymentSettings,
  getSiteSettings,
  savePaymentSettings,
  saveSiteSettings,
  type PaymentSettings,
} from "@/lib/server/ops";
import {
  deleteProvider,
  listOrdersAdmin,
  listProviders,
  markOrderPaid,
  saveProvider,
  type OrderRecord,
  type ProviderPublic,
} from "@/lib/server/payment/service";
import type { ProviderType } from "@/lib/server/payment/types";

const fieldClass =
  "h-12 w-full rounded-2xl bg-void-elevated px-4 text-sm text-fg shadow-border outline-none placeholder:text-muted focus-visible:shadow-border-hover";

const CRED_FIELDS: Record<ProviderType, { key: string; label: string; secret?: boolean; placeholder?: string }[]> = {
  easypay: [
    { key: "pid", label: "PID / 商户 ID" },
    { key: "pkey", label: "商户密钥", secret: true },
    { key: "apiBase", label: "API", placeholder: "https://zpayz.cn" },
    { key: "alipayChannel", label: "支付宝 CID（可选）" },
    { key: "wechatChannel", label: "微信 CID（可选）" },
  ],
  alipay: [
    { key: "appId", label: "App ID" },
    { key: "appPrivateKey", label: "App private key", secret: true },
    { key: "alipayPublicKey", label: "Alipay public key", secret: true },
  ],
  wxpay: [
    { key: "appId", label: "App ID" },
    { key: "mchId", label: "Mch ID" },
    { key: "serialNo", label: "Serial" },
    { key: "privateKey", label: "Merchant key", secret: true },
    { key: "apiV3Key", label: "APIv3 key", secret: true },
    { key: "wechatPublicKey", label: "WeChat public key", secret: true },
    { key: "wechatPublicKeyId", label: "Public key ID" },
  ],
  stripe: [
    { key: "secretKey", label: "Secret key", secret: true },
    { key: "publishableKey", label: "Publishable key" },
    { key: "webhookSecret", label: "Webhook secret", secret: true },
  ],
};

export function PaymentDesk() {
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [origin, setOrigin] = useState("");
  const [providers, setProviders] = useState<ProviderPublic[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [type, setType] = useState<ProviderType>("easypay");
  const [name, setName] = useState("Z-Pay");
  const [creds, setCreds] = useState<Record<string, string>>({ apiBase: "https://zpayz.cn" });
  const [saving, setSaving] = useState(false);

  const reload = () => {
    void getPaymentSettings().then(setSettings);
    void getSiteSettings().then((site) => setOrigin(site.origin));
    void listProviders().then(setProviders);
    void listOrdersAdmin().then(setOrders);
  };

  useEffect(() => {
    reload();
  }, []);

  if (!settings) return <div className="mt-8 h-40 animate-pulse rounded-2xl bg-void-elevated" />;

  return (
    <div className="mt-8 space-y-10">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSaving(true);
          void Promise.all([
            savePaymentSettings({ data: settings }),
            saveSiteSettings({ data: { origin } }),
          ])
            .then(() => toast.success(strings.paySaved))
            .catch(() => toast.error(strings.authFailed))
            .finally(() => setSaving(false));
        }}
      >
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(event) => setSettings({ ...settings, enabled: event.target.checked })}
          />
          {strings.payEnabled}
        </label>
        <Field label={strings.payOrigin}>
          <input className={fieldClass} value={origin} onChange={(event) => setOrigin(event.target.value)} />
        </Field>
        {origin ? (
          <p className="text-xs leading-relaxed text-muted">
            {strings.payNotifyHint}
            <br />
            <span className="font-mono text-fg">{origin.replace(/\/$/, "")}/api/payment/webhook/easypay</span>
            <br />
            <span className="font-mono text-fg">{origin.replace(/\/$/, "")}/pay/return</span>
          </p>
        ) : null}
        <Field label={strings.payPriceCny}>
          <input
            className={fieldClass}
            value={settings.priceCny}
            onChange={(event) => setSettings({ ...settings, priceCny: event.target.value })}
          />
        </Field>
        <Field label={strings.payPriceUsd}>
          <input
            className={fieldClass}
            value={settings.priceUsd}
            onChange={(event) => setSettings({ ...settings, priceUsd: event.target.value })}
          />
        </Field>
        <Field label={strings.payPriceMaxCny}>
          <input
            className={fieldClass}
            value={settings.priceMaxCny ?? ""}
            onChange={(event) => setSettings({ ...settings, priceMaxCny: event.target.value })}
          />
        </Field>
        <Field label={strings.payPriceMaxUsd}>
          <input
            className={fieldClass}
            value={settings.priceMaxUsd ?? ""}
            onChange={(event) => setSettings({ ...settings, priceMaxUsd: event.target.value })}
          />
        </Field>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={settings.alipayEnabled}
            onChange={(event) => setSettings({ ...settings, alipayEnabled: event.target.checked })}
          />
          {strings.payAlipay}
        </label>
        <Field label={strings.payAlipaySource}>
          <select
            className={fieldClass}
            value={settings.alipaySource}
            onChange={(event) =>
              setSettings({ ...settings, alipaySource: event.target.value as PaymentSettings["alipaySource"] })
            }
          >
            <option value="easypay">{strings.payViaEasypay}</option>
            <option value="official">{strings.payViaOfficial}</option>
          </select>
        </Field>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={settings.wechatEnabled}
            onChange={(event) => setSettings({ ...settings, wechatEnabled: event.target.checked })}
          />
          {strings.payWechat}
        </label>
        <Field label={strings.payWechatSource}>
          <select
            className={fieldClass}
            value={settings.wechatSource}
            onChange={(event) =>
              setSettings({ ...settings, wechatSource: event.target.value as PaymentSettings["wechatSource"] })
            }
          >
            <option value="easypay">{strings.payViaEasypay}</option>
            <option value="official">{strings.payViaOfficial}</option>
          </select>
        </Field>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={settings.stripeEnabled}
            onChange={(event) => setSettings({ ...settings, stripeEnabled: event.target.checked })}
          />
          {strings.payCard}
        </label>
        <Field label={strings.payHelp}>
          <textarea
            className={`${fieldClass} h-24 py-3`}
            value={settings.helpText}
            onChange={(event) => setSettings({ ...settings, helpText: event.target.value })}
          />
        </Field>
        <p className="text-xs leading-relaxed text-muted">{strings.payHint}</p>
        <Button type="submit" disabled={saving}>
          {saving ? strings.working : strings.save}
        </Button>
      </form>

      <section>
        <h2 className="text-lg font-medium">{strings.payProviders}</h2>
        <ul className="mt-4 space-y-2">
          {providers.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-void-elevated px-4 py-3 text-sm shadow-border"
            >
              <span>
                {row.name} · {row.type} {row.enabled ? "" : `· ${strings.payOff}`}
              </span>
              <button
                type="button"
                className="text-muted hover:text-fg"
                onClick={() => {
                  void deleteProvider({ data: { id: row.id } }).then(reload);
                }}
              >
                {strings.payRemove}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-3 rounded-3xl bg-void-elevated p-5 shadow-border">
          <Field label={strings.payProviderType}>
            <select
              className={fieldClass}
              value={type}
              onChange={(event) => {
                const next = event.target.value as ProviderType;
                setType(next);
                setName(next === "easypay" ? "Z-Pay" : next);
                setCreds(next === "easypay" ? { apiBase: "https://zpayz.cn" } : {});
              }}
            >
              <option value="easypay">Z-Pay / 易支付</option>
              <option value="alipay">{strings.payViaOfficial} Alipay</option>
              <option value="wxpay">{strings.payViaOfficial} WeChat</option>
              <option value="stripe">Stripe</option>
            </select>
          </Field>
          <Field label={strings.name}>
            <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          {CRED_FIELDS[type].map((field) => (
            <Field key={field.key} label={field.label}>
              <input
                className={fieldClass}
                type={field.secret ? "password" : "text"}
                autoComplete="off"
                placeholder={field.placeholder}
                value={creds[field.key] ?? ""}
                onChange={(event) => setCreds({ ...creds, [field.key]: event.target.value })}
              />
            </Field>
          ))}
          <Button
            type="button"
            onClick={() => {
              void saveProvider({
                data: {
                  type,
                  name,
                  enabled: true,
                  credentials:
                    type === "easypay" ? { ...creds, apiBase: creds.apiBase || "https://zpayz.cn" } : creds,
                },
              })
                .then(() => {
                  toast.success(strings.paySaved);
                  setCreds({});
                  reload();
                })
                .catch((error: unknown) =>
                  toast.error(error instanceof Error ? error.message : strings.authFailed),
                );
            }}
          >
            {strings.payAddProvider}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium">{strings.payOrders}</h2>
        <ul className="mt-4 space-y-2">
          {orders.length === 0 ? <p className="text-sm text-muted">{strings.payNoOrders}</p> : null}
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-void-elevated px-4 py-3 text-sm shadow-border">
              <p>
                {order.outTradeNo} · {order.method} · {order.currency} {order.amount}
              </p>
              <p className="mt-1 text-xs text-muted">{order.status}</p>
              {order.status === "PENDING" ? (
                <button
                  type="button"
                  className="mt-2 text-accent hover:underline"
                  onClick={() => {
                    void markOrderPaid({ data: { outTradeNo: order.outTradeNo } })
                      .then(() => {
                        toast.success(strings.payDone);
                        reload();
                      })
                      .catch(() => toast.error(strings.authFailed));
                  }}
                >
                  {strings.payMarkPaid}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-wide text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}
