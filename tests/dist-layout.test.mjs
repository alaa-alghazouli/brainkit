import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const distDirectory = path.resolve("dist");

test("build output includes required runtime files", () => {
  const expectedPaths = [
    "dist/index.js",
    "dist/index.d.ts",
    "dist/cli.js",
    "dist/skills/manifest.json",
    "dist/skills/threejs-performance-optimizer/SKILL.md",
    "dist/skill-artifacts/threejs-performance-optimizer.skill",
    "dist/tools/manifest.json",
  ];

  for (const expectedPath of expectedPaths) {
    assert.ok(
      existsSync(path.resolve(expectedPath)),
      `Missing build output: ${expectedPath}`,
    );
  }
});

test("cli build output keeps executable permissions", () => {
  const cliStats = statSync(path.join(distDirectory, "cli.js"));
  const executeBits = cliStats.mode & 0o111;

  assert.ok(executeBits > 0, "CLI file is not executable");
});

test("manifest in build output includes known skill metadata", () => {
  const manifest = JSON.parse(
    readFileSync(path.join(distDirectory, "skills", "manifest.json"), "utf8"),
  );

  assert.equal(manifest.version, 1);
  assert.ok(
    manifest.skills.some(
      (skill) => skill.slug === "threejs-performance-optimizer",
    ),
  );
});

test("tool manifest in build output is valid", () => {
  const toolsManifest = JSON.parse(
    readFileSync(path.join(distDirectory, "tools", "manifest.json"), "utf8"),
  );

  assert.equal(toolsManifest.version, 1);
  assert.ok(Array.isArray(toolsManifest.tools));
});
