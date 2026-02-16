#!/usr/bin/env node

import {
  getManifest,
  getSkillArtifactPath,
  getSkillSourcePath,
  getToolsManifest,
  installAll,
  installSkill,
  listSkills,
} from "./index.js";

function parseOptions(argv) {
  const options = {
    mode: "artifact",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--dest") {
      options.dest = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === "--mode") {
      options.mode = argv[index + 1];
      index += 1;
      continue;
    }
  }

  return options;
}

function printHelp() {
  console.log(`brainkit CLI

Usage:
  brainkit list
  brainkit catalog
  brainkit manifest
  brainkit where <skill> [--mode artifact|source]
  brainkit install <skill|all> --dest <path> [--mode artifact|source]

Examples:
  brainkit list
  brainkit catalog
  brainkit install threejs-performance-optimizer --dest ~/.config/opencode/skills
  brainkit install all --mode source --dest ./local-skills
`);
}

async function run() {
  const argv = process.argv.slice(2);
  const command = argv[0];

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    printHelp();
    return;
  }

  if (command === "list") {
    const skills = listSkills();
    for (const skill of skills) {
      console.log(skill);
    }
    return;
  }

  if (command === "manifest") {
    console.log(JSON.stringify(getManifest(), null, 2));
    return;
  }

  if (command === "catalog") {
    const manifest = getManifest();
    const tools = getToolsManifest();

    console.log(
      JSON.stringify(
        {
          version: 1,
          skills: manifest.skills,
          tools: tools.tools,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (command === "where") {
    const skillName = argv[1];
    if (!skillName) {
      throw new Error('Skill name is required for "where" command.');
    }

    const options = parseOptions(argv.slice(2));
    if (options.mode === "source") {
      console.log(getSkillSourcePath(skillName));
      return;
    }

    console.log(getSkillArtifactPath(skillName));
    return;
  }

  if (command === "install") {
    const skillName = argv[1];
    if (!skillName) {
      throw new Error('Skill name is required for "install" command.');
    }

    const options = parseOptions(argv.slice(2));
    if (!options.dest) {
      throw new Error("Destination path is required. Use --dest <path>.");
    }

    if (!["artifact", "source"].includes(options.mode)) {
      throw new Error("Invalid mode. Use --mode artifact or --mode source.");
    }

    if (skillName === "all") {
      const results = await installAll(options.dest, { mode: options.mode });
      for (const result of results) {
        console.log(`${result.skill} -> ${result.outputPath}`);
      }
      return;
    }

    const result = await installSkill(skillName, options.dest, {
      mode: options.mode,
    });
    console.log(`${result.skill} -> ${result.outputPath}`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
