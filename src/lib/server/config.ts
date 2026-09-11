import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export type SiteConfig = {
  site: { origin: string; port: number };
  admin: { email: string; password: string; name: string };
  auth: { secret: string };
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
    inbox: string;
  };
  redis: { url: string };
};

const FALLBACK: SiteConfig = {
  site: { origin: "https://CHANGE_ME_DOMAIN", port: 3000 },
  admin: {
    email: "CHANGE_ME_ADMIN_EMAIL",
    password: "CHANGE_ME_ADMIN_PASSWORD",
    name: "Meridian Desk",
  },
  auth: { secret: "CHANGE_ME_BETTER_AUTH_SECRET_32_CHARS_MIN" },
  database: {
    host: "db",
    port: 5432,
    name: "meridian",
    user: "meridian",
    password: "CHANGE_ME_POSTGRES_PASSWORD",
  },
  smtp: {
    host: "smtp.resend.com",
    port: 465,
    username: "resend",
    password: "CHANGE_ME_RESEND_API_KEY",
    fromEmail: "CHANGE_ME_FROM_EMAIL",
    fromName: "Meridian",
    inbox: "CHANGE_ME_INBOX_EMAIL",
  },
  redis: { url: "redis://redis:6379" },
};

export function isPlaceholder(value: string | undefined) {
  return !value || value.startsWith("CHANGE_ME");
}

export function configPath() {
  return process.env.CONFIG_PATH?.trim() || resolve(process.cwd(), "config.json");
}

export function loadSiteConfig(): SiteConfig {
  const path = configPath();
  if (!existsSync(path)) return FALLBACK;
  const parsed = JSON.parse(readFileSync(path, "utf8")) as Partial<SiteConfig>;
  return {
    site: { ...FALLBACK.site, ...parsed.site },
    admin: { ...FALLBACK.admin, ...parsed.admin },
    auth: { ...FALLBACK.auth, ...parsed.auth },
    database: { ...FALLBACK.database, ...parsed.database },
    smtp: { ...FALLBACK.smtp, ...parsed.smtp },
    redis: { ...FALLBACK.redis, ...parsed.redis },
  };
}
