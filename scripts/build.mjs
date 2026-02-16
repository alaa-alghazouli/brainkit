import {
  chmodSync,
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = path.join(root, "dist");
const sourceDirectory = path.join(root, "src");
const skillsDirectory = path.join(root, "skills");
const artifactsDirectory = path.join(root, "skill-artifacts");
const toolsDirectory = path.join(root, "tools");

if (!existsSync(skillsDirectory)) {
  throw new Error(`Missing skills directory: ${skillsDirectory}`);
}

if (!existsSync(artifactsDirectory)) {
  throw new Error(`Missing skill-artifacts directory: ${artifactsDirectory}`);
}

if (!existsSync(toolsDirectory)) {
  throw new Error(`Missing tools directory: ${toolsDirectory}`);
}

rmSync(distDirectory, { recursive: true, force: true });
mkdirSync(distDirectory, { recursive: true });

copyFileSync(
  path.join(sourceDirectory, "index.js"),
  path.join(distDirectory, "index.js"),
);
copyFileSync(
  path.join(sourceDirectory, "index.d.ts"),
  path.join(distDirectory, "index.d.ts"),
);
copyFileSync(
  path.join(sourceDirectory, "cli.js"),
  path.join(distDirectory, "cli.js"),
);
chmodSync(path.join(distDirectory, "cli.js"), 0o755);

cpSync(skillsDirectory, path.join(distDirectory, "skills"), {
  recursive: true,
});
cpSync(artifactsDirectory, path.join(distDirectory, "skill-artifacts"), {
  recursive: true,
});
cpSync(toolsDirectory, path.join(distDirectory, "tools"), { recursive: true });

console.log("Built npm package output in dist/");
