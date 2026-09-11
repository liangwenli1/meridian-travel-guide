#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const path = process.env.CONFIG_PATH?.trim() || resolve(process.cwd(), "config.json");
if (!existsSync(path)) {
  console.error(`[config] missing ${path}`);
  process.exit(1);
}

const config = JSON.parse(readFileSync(path, "utf8"));
const database = config.database ?? {};
const site = config.site ?? {};
const auth = config.auth ?? {};
const redis = config.redis ?? {};
const host = process.env.DATABASE_HOST || database.host || "db";
const user = encodeURIComponent(database.user || "meridian");
const password = encodeURIComponent(database.password || "");
const port = database.port || 5432;
const name = database.name || "meridian";

const env = {
  ...process.env,
  DATABASE_URL: `postgres://${user}:${password}@${host}:${port}/${name}`,
  BETTER_AUTH_SECRET: auth.secret || "",
  BETTER_AUTH_URL: String(site.origin || "").replace(/\/$/, ""),
  PORT: String(site.port || process.env.PORT || 3000),
  HOST: process.env.HOST || "0.0.0.0",
  REDIS_URL: redis.url || "redis://redis:6379",
  CONFIG_PATH: path,
};

const args = process.argv.slice(2);
if (args.length === 0) {
  process.stdout.write(`POSTGRES_PASSWORD=${database.password || ""}\n`);
  process.stdout.write(`APP_PORT=${site.port || 3000}\n`);
  process.exit(0);
}

const child = spawn(args[0], args.slice(1), { stdio: "inherit", env });
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
