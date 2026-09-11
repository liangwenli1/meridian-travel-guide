import { createFileRoute } from "@tanstack/react-router";
import { handleAlipayNotify, paramsFromRequest } from "@/lib/server/payment/engine";

async function handle(request: Request) {
  const params = await paramsFromRequest(request);
  const ok = await handleAlipayNotify(params);
  return new Response(ok ? "success" : "fail", {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/payment/webhook/alipay")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
