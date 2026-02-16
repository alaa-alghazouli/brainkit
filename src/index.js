import {
  cpSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = fileURLToPath(new URL(".", import.meta.url));
const localSkillsDir = path.join(moduleDirectory, "skills");
const localArtifactsDir = path.join(moduleDirectory, "skill-artifacts");
const dataRoot =
  existsSync(localSkillsDir) && existsSync(localArtifactsDir)
    ? moduleDirectory
    : path.resolve(moduleDirectory, "..");

const skillsDir = path.join(dataRoot, "skills");
const artifactsDir = path.join(dataRoot, "skill-artifacts");
const manifestPath = path.join(skillsDir, "manifest.json");
const toolsManifestPath = path.join(dataRoot, "tools", "manifest.json");
const validInstallModes = new Set(["artifact", "source"]);

function ensureDirectoryExists(directoryPath, label) {
  if (!existsSync(directoryPath)) {
    throw new Error(`${label} not found: ${directoryPath}`);
  }
}

function resolveDestination(destination) {
  if (!destination) {
    throw new Error("Destination path is required.");
  }

  const absolutePath = path.resolve(destination);
  mkdirSync(absolutePath, { recursive: true });
  return absolutePath;
}

function assertSkillExists(skillName) {
  const availableSkills = listSkills();
  if (!availableSkills.includes(skillName)) {
    throw new Error(
      `Unknown skill: ${skillName}. Available skills: ${availableSkills.join(", ")}`,
    );
  }
}

function resolveInstallMode(mode) {
  const installMode = mode ?? "artifact";

  if (!validInstallModes.has(installMode)) {
    throw new Error(
      `Invalid mode: ${installMode}. Use \"artifact\" or \"source\".`,
    );
  }

  return installMode;
}

export function listSkills() {
  ensureDirectoryExists(skillsDir, "Skills directory");

  const entries = readdirSync(skillsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function getManifest() {
  if (!existsSync(manifestPath)) {
    return {
      version: 1,
      skills: listSkills().map((skillName) => ({
        slug: skillName,
      })),
    };
  }

  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function getToolsManifest() {
  if (!existsSync(toolsManifestPath)) {
    return {
      version: 1,
      tools: [],
    };
  }

  return JSON.parse(readFileSync(toolsManifestPath, "utf8"));
}

export function getSkillSourcePath(skillName) {
  assertSkillExists(skillName);
  return path.join(skillsDir, skillName);
}

export function getSkillArtifactPath(skillName) {
  assertSkillExists(skillName);
  ensureDirectoryExists(artifactsDir, "Skill artifacts directory");

  const artifactPath = path.join(artifactsDir, `${skillName}.skill`);
  if (!existsSync(artifactPath)) {
    throw new Error(`Missing artifact for ${skillName}: ${artifactPath}`);
  }

  return artifactPath;
}

export async function installSkill(skillName, destination, options = {}) {
  const mode = resolveInstallMode(options.mode);
  const outputDirectory = resolveDestination(destination);

  if (mode === "source") {
    const sourcePath = getSkillSourcePath(skillName);
    const targetPath = path.join(outputDirectory, skillName);

    cpSync(sourcePath, targetPath, { recursive: true, force: true });

    return {
      skill: skillName,
      mode,
      outputPath: targetPath,
    };
  }

  const artifactPath = getSkillArtifactPath(skillName);
  const targetPath = path.join(outputDirectory, `${skillName}.skill`);

  copyFileSync(artifactPath, targetPath);

  return {
    skill: skillName,
    mode,
    outputPath: targetPath,
  };
}

export async function installAll(destination, options = {}) {
  const skills = listSkills();
  const installations = [];

  for (const skillName of skills) {
    const result = await installSkill(skillName, destination, options);
    installations.push(result);
  }

  return installations;
}
