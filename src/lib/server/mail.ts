import { readSmtp } from "@/lib/server/ops";

type SendLetterInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendLetterResult = { ok: true } | { ok: false; error: string };

export async function sendLetter(input: SendLetterInput): Promise<SendLetterResult> {
  const smtp = await readSmtp();
  if (!smtp.enabled) return { ok: false, error: "SMTP is not enabled" };
  if (!smtp.host || !smtp.fromEmail) return { ok: false, error: "SMTP host or from address is missing" };
  if (!smtp.username || !smtp.password) return { ok: false, error: "SMTP username or password is missing" };

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure || smtp.port === 465,
      auth: { user: smtp.username, pass: smtp.password },
    });
    await transporter.sendMail({
      from: smtp.fromName ? `"${smtp.fromName}" <${smtp.fromEmail}>` : smtp.fromEmail,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP send failed";
    return { ok: false, error: message };
  }
}

export function letterHtml(opts: { title: string; body: string; href: string; cta: string }) {
  const title = escapeHtml(opts.title);
  const body = escapeHtml(opts.body).replaceAll("\n", "<br>");
  const href = escapeHtml(opts.href);
  const cta = escapeHtml(opts.cta);
  return [
    "<!doctype html><html><body style=\"margin:0;background:#0b0b0b;color:#f4efe6;font-family:Inter,Helvetica,Arial,sans-serif;\">",
    "<div style=\"max-width:480px;margin:48px auto;padding:32px;background:#161616;border:1px solid #2a2a2a;border-radius:20px;\">",
    "<p style=\"letter-spacing:0.18em;text-transform:uppercase;font-size:11px;color:#c6a36a;margin:0 0 16px;\">Meridian</p>",
    `<h1 style="font-size:28px;font-weight:500;margin:0 0 12px;">${title}</h1>`,
    `<p style="font-size:15px;line-height:1.6;color:#b8b1a6;">${body}</p>`,
    `<p style="margin:28px 0 0;"><a href="${opts.href}" style="display:inline-block;background:#c6a36a;color:#0b0b0b;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;">${cta}</a></p>`,
    `<p style="margin:24px 0 0;font-size:12px;color:#7a736a;word-break:break-all;">${href}</p>`,
    "</div></body></html>",
  ].join("");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "\x26amp;")
    .replaceAll("<", "\x26lt;")
    .replaceAll(">", "\x26gt;")
    .replaceAll('"', "\x26quot;");
}
