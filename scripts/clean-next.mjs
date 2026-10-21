import { existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const DEV_LOCK_FILE = ".oviron-dev.lock";

export function devLockPath(cwd = process.cwd()) {
  return join(cwd, DEV_LOCK_FILE);
}

export function isDevLockActive(cwd = process.cwd()) {
  return existsSync(devLockPath(cwd));
}

/**
 * Remove dev/build caches that cause webpack "moduleId is not a function" errors.
 * @param {{ force?: boolean }} options — force skips dev-lock guard (explicit `npm run clean`)
 */
export function cleanNextCaches(cwd = process.cwd(), options = {}) {
  const { force = false } = options;

  if (!force && isDevLockActive(cwd)) {
    console.error(
      "[oviron] Refusing to delete .next — dev server is running (or stale lock).\n" +
        "  Stop `npm run dev` (Ctrl+C), delete .oviron-dev.lock if needed, then run clean/build again."
    );
    process.exit(1);
  }

  const targets = [".next", join("node_modules", ".cache")];
  for (const rel of targets) {
    const dir = join(cwd, rel);
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`[oviron] removed ${rel}`);
    }
  }
}

/** Safe dev start: clear tool caches only — keeps `.next` so preview/start is not broken. */
export function cleanDevCaches(cwd = process.cwd()) {
  const rel = join("node_modules", ".cache");
  const dir = join(cwd, rel);
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`[oviron] removed ${rel}`);
  }
}

const isMain =
  process.argv[1] &&
  resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);

if (isMain) {
  cleanNextCaches(process.cwd(), { force: true });
}
