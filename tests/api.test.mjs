import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  getManifest,
  getSkillArtifactPath,
  getSkillSourcePath,
  getToolsManifest,
  installAll,
  installSkill,
  listSkills,
} from "../dist/index.js";

const knownSkill = "threejs-performance-optimizer";

function createTempDir(prefix) {
  return mkdtempSync(path.join(os.tmpdir(), prefix));
}

test("listSkills returns sorted bundled skills", () => {
  const skills = listSkills();

  assert.ok(skills.length >= 1);
  assert.ok(skills.includes(knownSkill));

  const sorted = [...skills].sort();
  assert.deepEqual(skills, sorted);
});

test("getManifest returns declared metadata", () => {
  const manifest = getManifest();

  assert.equal(manifest.version, 1);
  assert.ok(Array.isArray(manifest.skills));

  const skillEntry = manifest.skills.find((skill) => skill.slug === knownSkill);
  assert.ok(skillEntry);
  assert.equal(skillEntry.name, "Threejs Performance Optimizer");
  assert.ok(typeof skillEntry.description === "string");
});

test("getToolsManifest returns valid shape", () => {
  const manifest = getToolsManifest();

  assert.equal(manifest.version, 1);
  assert.ok(Array.isArray(manifest.tools));
});

test("source and artifact paths resolve for known skill", () => {
  const sourcePath = getSkillSourcePath(knownSkill);
  const artifactPath = getSkillArtifactPath(knownSkill);

  assert.ok(existsSync(sourcePath));
  assert.ok(existsSync(path.join(sourcePath, "SKILL.md")));
  assert.ok(existsSync(artifactPath));
  assert.match(artifactPath, /\.skill$/);
});

test("unknown skill throws for source path", () => {
  assert.throws(
    () => getSkillSourcePath("unknown-skill"),
    /Unknown skill: unknown-skill/,
  );
});

test("unknown skill throws for artifact path", () => {
  assert.throws(
    () => getSkillArtifactPath("unknown-skill"),
    /Unknown skill: unknown-skill/,
  );
});

test("installSkill requires destination", async () => {
  await assert.rejects(
    () => installSkill(knownSkill),
    /Destination path is required/,
  );
});

test("installSkill validates mode", async () => {
  await assert.rejects(
    () =>
      installSkill(knownSkill, createTempDir("brainkit-invalid-mode-"), {
        mode: "zip",
      }),
    /Invalid mode: zip/,
  );
});

test("installSkill copies artifact in default mode", async () => {
  const destination = createTempDir("brainkit-artifact-");
  const result = await installSkill(knownSkill, destination);

  assert.equal(result.mode, "artifact");
  assert.ok(existsSync(result.outputPath));

  const sourceArtifact = getSkillArtifactPath(knownSkill);
  const sourceBytes = readFileSync(sourceArtifact);
  const outputBytes = readFileSync(result.outputPath);

  assert.equal(outputBytes.length, sourceBytes.length);
  assert.deepEqual(outputBytes, sourceBytes);
});

test("installSkill copies source in source mode", async () => {
  const destination = createTempDir("brainkit-source-");
  const result = await installSkill(knownSkill, destination, {
    mode: "source",
  });

  assert.equal(result.mode, "source");
  assert.ok(existsSync(result.outputPath));

  const skillFile = path.join(result.outputPath, "SKILL.md");
  const skillContent = readFileSync(skillFile, "utf8");

  assert.match(skillContent, /name: threejs-performance-optimizer/);
  assert.ok(existsSync(path.join(result.outputPath, "references")));
});

test("installSkill source mode overwrites destination directory", async () => {
  const destination = createTempDir("brainkit-overwrite-");
  const targetDirectory = path.join(destination, knownSkill);
  const targetSkillFile = path.join(targetDirectory, "SKILL.md");

  await installSkill(knownSkill, destination, { mode: "source" });
  writeFileSync(targetSkillFile, "corrupted", "utf8");

  const result = await installSkill(knownSkill, destination, {
    mode: "source",
  });
  const restoredContent = readFileSync(
    path.join(result.outputPath, "SKILL.md"),
    "utf8",
  );

  assert.match(restoredContent, /name: threejs-performance-optimizer/);
});

test("installAll installs all artifacts", async () => {
  const destination = createTempDir("brainkit-all-artifacts-");
  const installations = await installAll(destination);

  assert.equal(installations.length, listSkills().length);

  for (const installation of installations) {
    assert.equal(installation.mode, "artifact");
    assert.ok(existsSync(installation.outputPath));
    assert.ok(statSync(installation.outputPath).size > 0);
  }
});

test("installAll installs all source folders", async () => {
  const destination = createTempDir("brainkit-all-source-");
  const installations = await installAll(destination, { mode: "source" });

  assert.equal(installations.length, listSkills().length);

  for (const installation of installations) {
    assert.equal(installation.mode, "source");
    assert.ok(existsSync(path.join(installation.outputPath, "SKILL.md")));
  }
});
