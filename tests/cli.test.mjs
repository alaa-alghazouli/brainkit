import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const cliPath = path.resolve("dist/cli.js");
const knownSkill = "threejs-performance-optimizer";

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
  });
}

function createTempDir(prefix) {
  return mkdtempSync(path.join(os.tmpdir(), prefix));
}

test("cli prints help when no command is provided", () => {
  const result = runCli([]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /brainkit CLI/);
  assert.match(result.stdout, /Usage:/);
});

test("cli list prints bundled skills", () => {
  const result = runCli(["list"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /threejs-performance-optimizer/);
});

test("cli manifest returns valid JSON", () => {
  const result = runCli(["manifest"]);

  assert.equal(result.status, 0);

  const manifest = JSON.parse(result.stdout);
  assert.equal(manifest.version, 1);
  assert.ok(manifest.skills.some((skill) => skill.slug === knownSkill));
});

test("cli catalog returns valid aggregate JSON", () => {
  const result = runCli(["catalog"]);

  assert.equal(result.status, 0);

  const catalog = JSON.parse(result.stdout);
  assert.equal(catalog.version, 1);
  assert.ok(Array.isArray(catalog.skills));
  assert.ok(Array.isArray(catalog.tools));
  assert.ok(catalog.skills.some((skill) => skill.slug === knownSkill));
});

test("cli where prints artifact path by default", () => {
  const result = runCli(["where", knownSkill]);

  assert.equal(result.status, 0);
  const outputPath = result.stdout.trim();

  assert.match(outputPath, /\.skill$/);
  assert.ok(existsSync(outputPath));
});

test("cli where source mode prints source directory path", () => {
  const result = runCli(["where", knownSkill, "--mode", "source"]);

  assert.equal(result.status, 0);
  const outputPath = result.stdout.trim();

  assert.ok(existsSync(outputPath));
  assert.ok(existsSync(path.join(outputPath, "SKILL.md")));
});

test("cli where without skill name fails", () => {
  const result = runCli(["where"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Skill name is required for "where" command/);
});

test("cli install requires destination", () => {
  const result = runCli(["install", knownSkill]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Destination path is required/);
});

test("cli install validates mode", () => {
  const result = runCli([
    "install",
    knownSkill,
    "--dest",
    createTempDir("brainkit-cli-invalid-mode-"),
    "--mode",
    "zip",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid mode/);
});

test("cli install fails for unknown skill", () => {
  const destination = createTempDir("brainkit-cli-unknown-");
  const result = runCli(["install", "unknown-skill", "--dest", destination]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown skill: unknown-skill/);
});

test("cli install copies a single artifact", () => {
  const destination = createTempDir("brainkit-cli-install-");
  const result = runCli(["install", knownSkill, "--dest", destination]);

  assert.equal(result.status, 0);
  const outputPath = path.join(destination, `${knownSkill}.skill`);

  assert.ok(existsSync(outputPath));
  assert.match(result.stdout, new RegExp(`${knownSkill} ->`));
});

test("cli install all copies source folders", () => {
  const destination = createTempDir("brainkit-cli-install-all-source-");
  const result = runCli([
    "install",
    "all",
    "--mode",
    "source",
    "--dest",
    destination,
  ]);

  assert.equal(result.status, 0);

  const skillDirectory = path.join(destination, knownSkill);
  const skillFile = path.join(skillDirectory, "SKILL.md");

  assert.ok(existsSync(skillDirectory));
  assert.ok(existsSync(skillFile));
  assert.match(
    readFileSync(skillFile, "utf8"),
    /name: threejs-performance-optimizer/,
  );
});

test("cli reports unknown commands", () => {
  const result = runCli(["shipit"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command: shipit/);
});
