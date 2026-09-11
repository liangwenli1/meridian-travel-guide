import { getSql } from "@/lib/db";
import { isPlaceholder, loadSiteConfig } from "@/lib/server/config";
import { writeSetting } from "@/lib/server/ops";

const globalRef = globalThis as typeof globalThis & {
  __meridianAdminSeed__?: Promise<void>;
};

export function adminEmail() {
  return loadSiteConfig().admin.email.trim().toLowerCase();
}

async function findUser(email: string) {
  const sql = await getSql();
  const rows = await sql.query<{ id: string }>(
    `select id from "user" where lower(email) = $1 limit 1`,
    [email],
  );
  return rows[0] ?? null;
}

async function syncPassword(userId: string, password: string) {
  const { auth } = await import("@/lib/auth/server");
  const ctx = await auth.$context;
  const sql = await getSql();
  const rows = await sql.query<{ password: string | null }>(
    `select password from "account" where "userId" = $1 and "providerId" = 'credential' limit 1`,
    [userId],
  );
  const current = rows[0]?.password;
  if (current) {
    const matches = await ctx.password.verify({ password, hash: current });
    if (matches) return;
  }
  const hash = await ctx.password.hash(password);
  if (current) {
    await sql.query(
      `update "account" set password = $1, "updatedAt" = now() where "userId" = $2 and "providerId" = 'credential'`,
      [hash, userId],
    );
  } else {
    const id = crypto.randomUUID();
    await sql.query(
      `insert into "account" (
         id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt"
       ) values ($1,$2,'credential',$3,$4,now(),now())`,
      [id, userId, userId, hash],
    );
  }
  await sql.query(`delete from "session" where "userId" = $1`, [userId]);
}

async function seedAdmin() {
  const { admin } = loadSiteConfig();
  const email = admin.email.trim().toLowerCase();
  const password = admin.password;
  if (!email.includes("@") || password.length < 8) {
    throw new Error("config.json admin.email / admin.password are missing or too short (min 8)");
  }

  const sql = await getSql();
  let user = await findUser(email);
  if (!user) {
    const { auth } = await import("@/lib/auth/server");
    try {
      await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: admin.name.trim() || "Meridian Desk",
        },
      });
    } catch {
      // Unique-email race or already created on a previous pass.
    }
    user = await findUser(email);
    if (user) {
      await sql.query(`delete from "session" where "userId" = $1`, [user.id]);
    }
  }
  if (!user) throw new Error("Could not create the built-in admin account");

  await sql.query(`update "user" set "emailVerified" = true, "updatedAt" = now() where id = $1`, [
    user.id,
  ]);
  await sql.query(`insert into site_admins (user_id) values ($1) on conflict do nothing`, [user.id]);
  await syncPassword(user.id, password);
}

async function seedSmtpFromConfig() {
  const { smtp } = loadSiteConfig();
  if (isPlaceholder(smtp.password) || !smtp.fromEmail.includes("@")) return;
  await writeSetting("smtp", {
    enabled: true,
    host: smtp.host || "smtp.resend.com",
    port: Number(smtp.port) || 465,
    username: smtp.username || "resend",
    password: smtp.password,
    fromName: smtp.fromName || "Meridian",
    fromEmail: smtp.fromEmail,
    secure: Number(smtp.port) === 465,
  });
}

async function seedSiteOrigin() {
  const origin = loadSiteConfig().site.origin.replace(/\/$/, "");
  if (!origin || isPlaceholder(origin)) return;
  await writeSetting("site", { origin });
}

async function seedOnce() {
  await seedAdmin();
  await seedSmtpFromConfig();
  await seedSiteOrigin();
}

export function ensureBuiltInAdmin(): Promise<void> {
  globalRef.__meridianAdminSeed__ ??= seedOnce().catch((error) => {
    globalRef.__meridianAdminSeed__ = undefined;
    throw error;
  });
  return globalRef.__meridianAdminSeed__;
}
