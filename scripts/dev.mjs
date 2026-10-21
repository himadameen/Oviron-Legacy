/**
 * Local dev: clear tool caches (not `.next`) so preview/start stays valid, then Turbopack.
 * Full reset: npm run dev:reset
 */
import { spawn } from "node:child_process";
import { writeFileSync, unlinkSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { cleanDevCaches, devLockPath } from "./clean-next.mjs";

cleanDevCaches();

const lock = devLockPath();
try {
  writeFileSync(lock, String(process.pid), "utf8");
} catch {
  /* ignore */
}

function releaseLock() {
  try {
    if (existsSync(lock)) unlinkSync(lock);
  } catch {
    /* ignore */
  }
}

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const useTurbo = process.env.NEXT_DISABLE_TURBOPACK !== "1";
const args = ["dev"];
if (useTurbo) {
  args.push("--turbopack");
}

console.log(
  useTurbo
    ? "[oviron dev] Turbopack (NEXT_DISABLE_TURBOPACK=1 for webpack)"
    : "[oviron dev] webpack mode"
);
console.log(
  "[oviron dev] One server only — do not run build:clean while this terminal is running."
);

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: "inherit",
  env: process.env,
  windowsHide: true,
});

const shutdown = (signal) => {
  releaseLock();
  if (signal) {
    try {
      child.kill(signal);
    } catch {
      /* ignore */
    }
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("exit", releaseLock);

child.on("exit", (code, signal) => {
  releaseLock();
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
