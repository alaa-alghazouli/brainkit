import assert from "node:assert/strict";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const SCRIPT = path.resolve("scripts/validate-skills.mjs");
const MANIFEST = path.resolve("skills/manifest.json");
const SKILL_DIR = path.resolve("skills/threejs-performance-optimizer");
const SKILL_MD = path.join(SKILL_DIR, "SKILL.md");
const ARTIFACT = path.resolve(
  "skill-artifacts/threejs-performance-optimizer.skill",
);

function runValidate() {
  return spawnSync(process.execPath, [SCRIPT], { encoding: "utf8" });
}

test("validate-skills fails when manifest has no skills array", () => {
  const original = readFileSync(MANIFEST, "utf8");
  writeFileSync(MANIFEST, JSON.stringify({ version: 1 }));
  try {
    const result = runValidate();
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /Manifest must include at least one skill entry/,
    );
  } finally {
    writeFileSync(MANIFEST, original);
  }
});

test("validate-skills fails on slug mismatch between directory and manifest", () => {
  const backup = path.resolve("skills/threejs-performance-optimizer.__test_backup__");
  renameSync(SKILL_DIR, backup);
  try {
    const result = runValidate();
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /Manifest skill slugs do not match skills directory/,
    );
  } finally {
    renameSync(backup, SKILL_DIR);
  }
});

test("validate-skills fails when SKILL.md is missing", () => {
  const backup = SKILL_MD + ".__test_backup__";
  renameSync(SKILL_MD, backup);
  try {
    const result = runValidate();
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /Missing SKILL\.md for threejs-performance-optimizer/,
    );
  } finally {
    renameSync(backup, SKILL_MD);
  }
});

test("validate-skills fails when frontmatter has invalid keys", () => {
  const original = readFileSync(SKILL_MD, "utf8");
  const bad = original.replace(
    /^---\n/,
    "---\nname: test\ndescription: test\nauthor: nobody\n---\nOVERWRITTEN\n",
  );
  // Overwrite with frontmatter containing an extra key (author)
  writeFileSync(
    SKILL_MD,
    "---\nname: test\ndescription: test\nauthor: nobody\n---\nBody content.\n",
  );
  try {
    const result = runValidate();
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /Frontmatter in .* must include only name and description/,
    );
  } finally {
    writeFileSync(SKILL_MD, original);
  }
});

test("validate-skills fails when artifact is below size threshold", () => {
  const original = readFileSync(ARTIFACT);
  writeFileSync(ARTIFACT, "tiny");
  try {
    const result = runValidate();
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /Artifact appears too small for threejs-performance-optimizer/,
    );
  } finally {
    writeFileSync(ARTIFACT, original);
  }
});
