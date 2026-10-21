import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const buildId = join(process.cwd(), ".next", "BUILD_ID");

if (!existsSync(buildId)) {
  console.error(
    "[oviron] No production build found (.next/BUILD_ID missing).\n" +
      "  Run: npm run preview   (build + start)\n" +
      "  Or:  npm run build:clean && npm run start"
  );
  process.exit(1);
}

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "start"], {
  stdio: "inherit",
  env: process.env,
  windowsHide: true,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
