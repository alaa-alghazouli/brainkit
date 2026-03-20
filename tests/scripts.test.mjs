import assert from "node:assert/strict";
import { existsSync, renameSync } from "node:fs";
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

test("build script fails when skills/ directory is missing", () => {
  const dir = path.resolve("skills");
  const backup = path.resolve("skills.__test_backup__");
  renameSync(dir, backup);
  try {
    const result = runNodeScript(path.resolve("scripts/build.mjs"));
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Missing skills directory/);
  } finally {
    renameSync(backup, dir);
  }
});

test("build script fails when skill-artifacts/ directory is missing", () => {
  const dir = path.resolve("skill-artifacts");
  const backup = path.resolve("skill-artifacts.__test_backup__");
  renameSync(dir, backup);
  try {
    const result = runNodeScript(path.resolve("scripts/build.mjs"));
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Missing skill-artifacts directory/);
  } finally {
    renameSync(backup, dir);
  }
});

test("build script fails when tools/ directory is missing", () => {
  const dir = path.resolve("tools");
  const backup = path.resolve("tools.__test_backup__");
  renameSync(dir, backup);
  try {
    const result = runNodeScript(path.resolve("scripts/build.mjs"));
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Missing tools directory/);
  } finally {
    renameSync(backup, dir);
  }
});
