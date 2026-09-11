export type ProviderType = "easypay" | "alipay" | "wxpay" | "stripe";
export type PayMethod = "alipay" | "wechat" | "stripe";
export type OrderStatus = "PENDING" | "COMPLETED" | "EXPIRED" | "CANCELLED" | "FAILED";

export type EasyPayCredentials = {
  pid: string;
  pkey: string;
  apiBase: string;
  alipayChannel?: string;
  wechatChannel?: string;
};

export type AlipayCredentials = {
  appId: string;
  appPrivateKey: string;
  alipayPublicKey: string;
};

export type WxpayCredentials = {
  appId: string;
  mchId: string;
  privateKey: string;
  apiV3Key: string;
  wechatPublicKey: string;
  wechatPublicKeyId: string;
  serialNo: string;
};

export type StripeCredentials = {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
};

export type ProviderRow = {
  id: string;
  type: ProviderType;
  name: string;
  enabled: boolean;
  credentials: Record<string, string>;
  extra: Record<string, string>;
  min_amount: string | null;
  max_amount: string | null;
  daily_limit: string | null;
  sort_order: number;
};

export type ProviderPublic = {
  id: string;
  type: ProviderType;
  name: string;
  enabled: boolean;
  credentials: Record<string, string>;
  minAmount: string;
  maxAmount: string;
  dailyLimit: string;
  sortOrder: number;
};

export type ChargeResult = {
  payUrl?: string;
  qrCode?: string;
  urlScheme?: string;
  tradeNo?: string;
  raw?: unknown;
};

export type OrderRecord = {
  id: string;
  userId: string;
  providerId: string | null;
  providerType: string;
  method: string;
  outTradeNo: string;
  tradeNo: string | null;
  amount: string;
  currency: string;
  product: string;
  status: OrderStatus;
  payUrl: string | null;
  qrCode: string | null;
  urlScheme: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export type CheckoutRequest = {
  method: PayMethod;
  device?: "pc" | "mobile";
  plan?: "pro" | "max";
};
