import { isPlaceholder, loadSiteConfig } from "@/lib/server/config";

type RedisClient = import("ioredis").default;

const globalRef = globalThis as typeof globalThis & {
  __meridianRedis__?: RedisClient | null;
};

function redisUrl() {
  const fromEnv = process.env.REDIS_URL?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV !== "production") return "";
  const fromConfig = loadSiteConfig().redis?.url?.trim();
  if (fromConfig && !isPlaceholder(fromConfig)) return fromConfig;
  return "";
}

export async function getRedis(): Promise<RedisClient | null> {
  if (globalRef.__meridianRedis__ !== undefined) return globalRef.__meridianRedis__;
  const url = redisUrl();
  if (!url) {
    globalRef.__meridianRedis__ = null;
    return null;
  }
  try {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true,
    });
    await client.connect();
    globalRef.__meridianRedis__ = client;
    return client;
  } catch (error) {
    console.error("[redis] connect failed", error);
    globalRef.__meridianRedis__ = null;
    return null;
  }
}

export async function visitorIp() {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const forwarded = request?.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
    return request?.headers.get("cf-connecting-ip") || request?.headers.get("x-real-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

/** Returns true when the caller is still inside the limit. */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return true;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, windowSec);
  return n <= limit;
}

export async function cachedJson<T>(key: string, ttlSec: number, load: () => Promise<T>): Promise<T> {
  const redis = await getRedis();
  if (redis) {
    const hit = await redis.get(key);
    if (hit) return JSON.parse(hit) as T;
  }
  const value = await load();
  if (redis) await redis.set(key, JSON.stringify(value), "EX", ttlSec);
  return value;
}

export async function bustCache(keys: string[]) {
  const redis = await getRedis();
  if (!redis || keys.length === 0) return;
  await redis.del(...keys);
}
