import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

function runNodeScript(scriptPath) {
  return spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
  });
}

test("validate-skills script succeeds", () => {
  const result = runNodeScript(path.resolve("scripts/validate-skills.mjs"));

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Validated\s+\d+\s+skill/);
});

test("build script succeeds and regenerates dist output", () => {
  const result = runNodeScript(path.resolve("scripts/build.mjs"));

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Built npm package output in dist/);
  assert.ok(existsSync(path.resolve("dist/index.js")));
  assert.ok(existsSync(path.resolve("dist/skills/manifest.json")));
  assert.ok(
    existsSync(
      path.resolve("dist/skill-artifacts/threejs-performance-optimizer.skill"),
    ),
  );
});
