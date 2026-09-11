import { createFileRoute } from "@tanstack/react-router";
import { handleWxpayNotify } from "@/lib/server/payment/engine";

export const Route = createFileRoute("/api/payment/webhook/wxpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        const ok = await handleWxpayNotify(body);
        return Response.json(
          ok ? { code: "SUCCESS", message: "成功" } : { code: "FAIL", message: "失败" },
        );
      },
    },
  },
});
