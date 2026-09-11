import { randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { letterHtml, sendLetter } from "@/lib/server/mail";
import { publicOrigin, readSmtp, requireAdmin } from "@/lib/server/ops";

export type VerifyState = {
  email: string | null;
  verified: boolean;
};

export type StartSignupResult =
  | { ok: true; sent: true }
  | { ok: true; bootstrap: true }
  | { ok: false; error: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function findUserByEmail(email: string) {
  const sql = await getSql();
  const rows = await sql.query<{ id: string; emailVerified: boolean }>(
    `select id, "emailVerified" from "user" where lower(email) = $1 limit 1`,
    [email],
  );
  return rows[0] ?? null;
}

export async function markVerified(userId: string) {
  const sql = await getSql();
  await sql.query(`update "user" set "emailVerified" = true, "updatedAt" = now() where id = $1`, [
    userId,
  ]);
}

async function dropSessions(userId: string) {
  const sql = await getSql();
  await sql.query(`delete from "session" where "userId" = $1`, [userId]);
}

async function createAccount(opts: { email: string; password: string; name: string; verified: boolean }) {
  const { auth } = await import("@/lib/auth/server");
  try {
    await auth.api.signUpEmail({
      body: {
        email: opts.email,
        password: opts.password,
        name: opts.name,
      },
    });
  } catch (error) {
    const existing = await findUserByEmail(opts.email);
    if (!existing) throw error;
    if (opts.verified) await markVerified(existing.id);
    await dropSessions(existing.id);
    return existing.id;
  }
  const row = await findUserByEmail(opts.email);
  if (!row) throw new Error("Could not create account");
  if (opts.verified) await markVerified(row.id);
  await dropSessions(row.id);
  return row.id;
}

async function sendConfirmLetter(email: string, token: string) {
  const origin = await publicOrigin();
  const href = `${origin}/verify-email?token=${encodeURIComponent(token)}`;
  return sendLetter({
    to: email,
    subject: "确认你的 Meridian 邮箱 / Confirm your Meridian email",
    text: `打开这个链接完成注册：\n${href}\n24 小时内有效。\n\nOpen this link to finish creating your account:\n${href}`,
    html: letterHtml({
      title: "确认你的邮箱",
      body: "点开链接才算注册成功。然后回到登录页，用这组邮箱和密码登录。链接 24 小时内有效。",
      href,
      cta: "完成注册",
    }),
  });
}

export const getVerifyState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<VerifyState> => {
    const sql = await getSql();
    const rows = await sql.query<{ email: string | null; emailVerified: boolean }>(
      `select email, "emailVerified" from "user" where id = $1`,
      [context.userId],
    );
    const row = rows[0];
    return { email: row?.email ?? null, verified: Boolean(row?.emailVerified) };
  });

export const startSignup = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string; name: string }) => data)
  .handler(async ({ data }): Promise<StartSignupResult> => {
    const email = normalizeEmail(data.email);
    const password = data.password;
    const name = data.name.trim() || email.split("@")[0] || "Traveler";
    if (!email.includes("@") || password.length < 8) {
      return { ok: false, error: "invalid" };
    }

    const { rateLimit, visitorIp } = await import("@/lib/server/redis");
    const ip = await visitorIp();
    if (!(await rateLimit(`signup:ip:${ip}`, 20, 3600)) || !(await rateLimit(`signup:email:${email}`, 5, 3600))) {
      return { ok: false, error: "rate-limited" };
    }

    const existing = await findUserByEmail(email);
    if (existing?.emailVerified) return { ok: false, error: "already-registered" };

    const smtp = await readSmtp();
    if (!smtp.enabled || !smtp.host || !smtp.fromEmail) {
      return { ok: false, error: "smtp-not-ready" };
    }

    const sql = await getSql();

    if (existing && !existing.emailVerified) {
      const token = randomBytes(32).toString("hex");
      const id = randomBytes(16).toString("hex");
      await sql.query(
        `insert into email_verifications (id, user_id, email, token, expires_at)
         values ($1, $2, $3, $4, now() + interval '24 hours')`,
        [id, existing.id, email, token],
      );
      const sent = await sendConfirmLetter(email, token);
      if (!sent.ok) return { ok: false, error: sent.error };
      return { ok: true, sent: true };
    }

    const token = randomBytes(32).toString("hex");
    const id = randomBytes(16).toString("hex");
    await sql.query(
      `insert into pending_signups (id, email, name, password, token, expires_at)
       values ($1, $2, $3, $4, $5, now() + interval '24 hours')
       on conflict (email) do update set
         name = excluded.name,
         password = excluded.password,
         token = excluded.token,
         expires_at = excluded.expires_at,
         created_at = now()`,
      [id, email, name, password, token],
    );
    const sent = await sendConfirmLetter(email, token);
    if (!sent.ok) {
      await sql.query(`delete from pending_signups where email = $1`, [email]);
      return { ok: false, error: sent.error };
    }
    return { ok: true, sent: true };
  });

export const resendSignup = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }): Promise<StartSignupResult> => {
    const email = normalizeEmail(data.email);
    const { rateLimit, visitorIp } = await import("@/lib/server/redis");
    const ip = await visitorIp();
    if (!(await rateLimit(`resend:ip:${ip}`, 10, 3600)) || !(await rateLimit(`resend:email:${email}`, 3, 3600))) {
      return { ok: false, error: "rate-limited" };
    }
    const smtp = await readSmtp();
    if (!smtp.enabled) return { ok: false, error: "smtp-not-ready" };
    const sql = await getSql();
    const pending = await sql.query<{ token: string }>(
      `select token from pending_signups where email = $1 and expires_at > now() limit 1`,
      [email],
    );
    if (pending[0]) {
      const token = randomBytes(32).toString("hex");
      await sql.query(
        `update pending_signups set token = $1, expires_at = now() + interval '24 hours' where email = $2`,
        [token, email],
      );
      const sent = await sendConfirmLetter(email, token);
      return sent.ok ? { ok: true, sent: true } : { ok: false, error: sent.error };
    }
    const user = await findUserByEmail(email);
    if (user && !user.emailVerified) {
      const token = randomBytes(32).toString("hex");
      await sql.query(
        `insert into email_verifications (id, user_id, email, token, expires_at)
         values ($1, $2, $3, $4, now() + interval '24 hours')`,
        [randomBytes(16).toString("hex"), user.id, email, token],
      );
      const sent = await sendConfirmLetter(email, token);
      return sent.ok ? { ok: true, sent: true } : { ok: false, error: sent.error };
    }
    return { ok: true, sent: true };
  });

export const confirmSignup = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const token = data.token.trim();
    if (!token) return { ok: false, error: "missing-token" };
    const sql = await getSql();

    const pending = await sql.query<{ email: string; name: string; password: string }>(
      `select email, name, password from pending_signups
       where token = $1 and expires_at > now()
       limit 1`,
      [token],
    );
    if (pending[0]) {
      const row = pending[0];
      const existing = await findUserByEmail(row.email);
      if (existing) {
        await markVerified(existing.id);
      } else {
        await createAccount({
          email: row.email,
          password: row.password,
          name: row.name,
          verified: true,
        });
      }
      await sql.query(`delete from pending_signups where email = $1`, [row.email]);
      return { ok: true };
    }

    const letter = await sql.query<{ user_id: string }>(
      `select user_id from email_verifications
       where token = $1 and expires_at > now()
       order by created_at desc
       limit 1`,
      [token],
    );
    if (!letter[0]) return { ok: false, error: "invalid" };
    await markVerified(letter[0].user_id);
    await sql.query(
      `update email_verifications set used_at = now() where token = $1 and used_at is null`,
      [token],
    );
    return { ok: true };
  });

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { to: string }) => data)
  .handler(async ({ context, data }): Promise<{ sent: boolean; error?: string }> => {
    await requireAdmin(context.userId);
    const to = data.to.trim();
    if (!to.includes("@")) return { sent: false, error: "invalid-email" };
    const result = await sendLetter({
      to,
      subject: "Meridian SMTP test",
      text: "SMTP is working. This desk can send mail from the configured mailbox.",
      html: letterHtml({
        title: "SMTP is working",
        body: "This desk can send mail from the configured mailbox — not from a personal inbox.",
        href: (await publicOrigin()) || "/",
        cta: "Open Meridian",
      }),
    });
    return result.ok ? { sent: true } : { sent: false, error: result.error };
  });
