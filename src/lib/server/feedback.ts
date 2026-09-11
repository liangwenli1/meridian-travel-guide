import { createServerFn } from "@tanstack/react-start";
import { isPlaceholder, loadSiteConfig } from "@/lib/server/config";
import { letterHtml, sendLetter } from "@/lib/server/mail";

export type SendFeedbackResult = { ok: true } | { ok: false; error: string };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export const sendFeedback = createServerFn({ method: "POST" })
  .validator((data: { email: string; name: string; message: string }) => data)
  .handler(async ({ data }): Promise<SendFeedbackResult> => {
    const email = normalizeEmail(data.email);
    const name = data.name.trim().slice(0, 80);
    const message = data.message.trim().slice(0, 4000);
    if (!email.includes("@") || email.length < 5) return { ok: false, error: "invalid" };
    if (message.length < 8) return { ok: false, error: "short" };

    const { rateLimit, visitorIp } = await import("@/lib/server/redis");
    const ip = await visitorIp();
    if (!(await rateLimit(`feedback:ip:${ip}`, 5, 3600)) || !(await rateLimit(`feedback:email:${email}`, 3, 3600))) {
      return { ok: false, error: "rate-limited" };
    }

    const config = loadSiteConfig();
    const inbox = (config.smtp.inbox || config.admin.email || "").trim().toLowerCase();
    if (!inbox.includes("@") || isPlaceholder(inbox)) return { ok: false, error: "inbox" };
    if (isPlaceholder(config.smtp.password)) return { ok: false, error: "smtp-not-ready" };

    const who = name || email;
    const sent = await sendLetter({
      to: inbox,
      replyTo: email,
      subject: `Meridian feedback from ${who}`,
      text: `From: ${who}\nEmail: ${email}\n\n${message}`,
      html: letterHtml({
        title: "New feedback",
        body: `${who} (${email})\n\n${message}`,
        href: `mailto:${email}`,
        cta: "Reply",
      }),
    });
    if (!sent.ok) return { ok: false, error: sent.error };
    return { ok: true };
  });
