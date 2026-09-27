import { cpSync, existsSync, rmSync, symlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const pluginRoot = fileURLToPath(new URL("../", import.meta.url));
const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const scratch = join(repositoryRoot, ".crowdmap-danger-local");
const rootNodeModules = join(repositoryRoot, "node_modules");

if (existsSync(rootNodeModules)) {
  throw new Error(`Refusing to replace existing ${rootNodeModules}`);
}

try {
  for (const path of ["classes", "helpers", "rules"]) {
    cpSync(join(pluginRoot, path), join(scratch, path), { recursive: true });
  }
  for (const path of ["dangerfile.ts", "danger-rules.ts"]) {
    cpSync(join(pluginRoot, path), join(scratch, path));
  }
  symlinkSync(join(pluginRoot, "node_modules"), rootNodeModules, "dir");

  const result = spawnSync(join(pluginRoot, "node_modules/.bin/danger"), [
    "local",
    "--base", "origin/development",
    "--dangerfile", ".crowdmap-danger-local/dangerfile.ts",
    "--text-only",
    "--failOnErrors",
  ], {
    cwd: repositoryRoot,
    env: { ...process.env, CROWDMAP_ROOT: repositoryRoot },
    stdio: "inherit",
  });
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(scratch, { force: true, recursive: true });
  rmSync(rootNodeModules, { force: true });
}
