import { createFileRoute } from "@tanstack/react-router";
import { handleStripeNotify } from "@/lib/server/payment/engine";

export const Route = createFileRoute("/api/payment/webhook/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("stripe-signature") ?? "";
        const ok = await handleStripeNotify(raw, signature);
        return new Response(ok ? "ok" : "invalid", { status: ok ? 200 : 400 });
      },
    },
  },
});
