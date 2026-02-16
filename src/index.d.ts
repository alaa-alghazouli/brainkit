export type InstallMode = "artifact" | "source";

export interface InstallOptions {
  mode?: InstallMode;
}

export interface InstallResult {
  skill: string;
  mode: InstallMode;
  outputPath: string;
}

export interface SkillManifestEntry {
  slug: string;
  name?: string;
  description?: string;
  version?: string;
}

export interface SkillManifest {
  version: number;
  skills: SkillManifestEntry[];
}

export interface ToolManifestEntry {
  slug: string;
  name?: string;
  description?: string;
  version?: string;
}

export interface ToolManifest {
  version: number;
  tools: ToolManifestEntry[];
}

export function listSkills(): string[];
export function getManifest(): SkillManifest;
export function getToolsManifest(): ToolManifest;
export function getSkillSourcePath(skillName: string): string;
export function getSkillArtifactPath(skillName: string): string;
export function installSkill(
  skillName: string,
  destination: string,
  options?: InstallOptions,
): Promise<InstallResult>;
export function installAll(
  destination: string,
  options?: InstallOptions,
): Promise<InstallResult[]>;
