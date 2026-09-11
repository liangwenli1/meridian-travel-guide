import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { CheckoutRequest, OrderRecord, PayMethod, ProviderPublic } from "@/lib/server/payment/types";

export type { OrderRecord, PayMethod, ProviderPublic };

export type PaymentPublic = {
  enabled: boolean;
  priceCny: string;
  priceUsd: string;
  helpText: string;
  methods: PayMethod[];
};

export const getPaymentPublic = createServerFn({ method: "GET" }).handler(async (): Promise<PaymentPublic> => {
  const engine = await import("./engine");
  return engine.getPaymentPublic();
});

export const listProviders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ProviderPublic[]> => {
    const engine = await import("./engine");
    return engine.listProviders(context.userId);
  });

export const saveProvider = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      id?: string;
      type: ProviderPublic["type"];
      name: string;
      enabled: boolean;
      credentials: Record<string, string>;
      minAmount?: string;
      maxAmount?: string;
      dailyLimit?: string;
    }) => data,
  )
  .handler(async ({ context, data }): Promise<ProviderPublic> => {
    const engine = await import("./engine");
    return engine.saveProvider(context.userId, data);
  });

export const deleteProvider = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }): Promise<{ ok: boolean }> => {
    const engine = await import("./engine");
    return engine.deleteProvider(context.userId, data.id);
  });

export const listOrdersAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OrderRecord[]> => {
    const engine = await import("./engine");
    return engine.listOrdersAdmin(context.userId);
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OrderRecord[]> => {
    const engine = await import("./engine");
    return engine.listMyOrders(context.userId);
  });

export const markOrderPaid = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { outTradeNo: string }) => data)
  .handler(async ({ context, data }): Promise<OrderRecord> => {
    const engine = await import("./engine");
    return engine.markOrderPaid(context.userId, data.outTradeNo);
  });

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: CheckoutRequest) => data)
  .handler(async ({ context, data }): Promise<OrderRecord> => {
    const engine = await import("./engine");
    return engine.createCheckout(context.userId, data);
  });

export const getOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }): Promise<OrderRecord> => {
    const engine = await import("./engine");
    return engine.getOrder(context.userId, data.id);
  });

export const getOrderByOut = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { outTradeNo: string }) => data)
  .handler(async ({ context, data }): Promise<OrderRecord> => {
    const engine = await import("./engine");
    return engine.getOrderByOut(context.userId, data.outTradeNo);
  });

export const cancelOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }): Promise<OrderRecord> => {
    const engine = await import("./engine");
    return engine.cancelOrder(context.userId, data.id);
  });
