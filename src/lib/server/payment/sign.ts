import { createHash, createHmac, createSign, createVerify, createDecipheriv, randomUUID, timingSafeEqual } from "node:crypto";

export function md5(value: string) {
  return createHash("md5").update(value, "utf8").digest("hex");
}

export function easypaySign(params: Record<string, string>, key: string) {
  const blob =
    Object.keys(params)
      .filter((k) => k !== "sign" && k !== "sign_type" && params[k] !== "")
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + key;
  return md5(blob);
}

export function easypayVerify(params: Record<string, string>, key: string) {
  const got = (params.sign || "").toLowerCase();
  const next = { ...params };
  delete next.sign;
  delete next.sign_type;
  return Boolean(got) && got === easypaySign(next, key);
}

export function toPem(raw: string, kind: "PRIVATE KEY" | "PUBLIC KEY" | "RSA PRIVATE KEY") {
  const trimmed = raw.trim().replace(/\\n/g, "\n");
  if (trimmed.includes("BEGIN")) return trimmed;
  const body = trimmed.replace(/\s+/g, "");
  const lines = body.match(/.{1,64}/g)?.join("\n") ?? body;
  return `-----BEGIN ${kind}-----\n${lines}\n-----END ${kind}-----`;
}

export function rsa2Sign(content: string, privateKey: string) {
  const signer = createSign("RSA-SHA256");
  signer.update(content, "utf8");
  signer.end();
  return signer.sign(toPem(privateKey, "PRIVATE KEY"), "base64");
}

export function rsa2Verify(content: string, signature: string, publicKey: string) {
  const verifier = createVerify("RSA-SHA256");
  verifier.update(content, "utf8");
  verifier.end();
  try {
    return verifier.verify(toPem(publicKey, "PUBLIC KEY"), signature, "base64");
  } catch {
    return false;
  }
}

export function alipaySign(params: Record<string, string>, privateKey: string) {
  const content = Object.keys(params)
    .filter((k) => k !== "sign" && params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return rsa2Sign(content, privateKey);
}

export function alipayVerify(params: Record<string, string>, publicKey: string) {
  const sign = params.sign;
  if (!sign) return false;
  const content = Object.keys(params)
    .filter((k) => k !== "sign" && k !== "sign_type" && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return rsa2Verify(content, sign, publicKey);
}

export function wechatMessage(method: string, path: string, timestamp: string, nonce: string, body: string) {
  return `${method}\n${path}\n${timestamp}\n${nonce}\n${body}\n`;
}

export function wechatAuth(opts: {
  mchId: string;
  serialNo: string;
  privateKey: string;
  method: string;
  path: string;
  body: string;
}) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomUUID().replaceAll("-", "");
  const message = wechatMessage(opts.method, opts.path, timestamp, nonce, opts.body);
  const signature = rsa2Sign(message, opts.privateKey);
  return {
    timestamp,
    nonce,
    authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${opts.mchId}",nonce_str="${nonce}",signature="${signature}",timestamp="${timestamp}",serial_no="${opts.serialNo}"`,
  };
}

export function decryptWechatResource(apiV3Key: string, nonce: string, ciphertext: string, associatedData: string) {
  const buf = Buffer.from(ciphertext, "base64");
  const authTag = buf.subarray(buf.length - 16);
  const data = buf.subarray(0, buf.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(apiV3Key), Buffer.from(nonce));
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(associatedData));
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

export function stripeVerify(rawBody: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((item) => {
      const [k, ...rest] = item.split("=");
      return [k.trim(), rest.join("=")];
    }),
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return expected === signature;
  }
}

export function newId(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${randomUUID().replaceAll("-", "").slice(0, 10)}`;
}

export function money2(value: string | number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}
