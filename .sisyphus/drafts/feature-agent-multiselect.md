# Feature: Agent Multi-Select UX

## Overview
Make it easier to install skills by offering an interactive multi-select prompt for known agents (like Claude, OpenCode, Windsurf) while retaining a manual target override option.

## Release Boundaries
* Out of scope for 2.0.1 patch.
* In scope for the next minor release.

## Acceptance Criteria
* [ ] Running `skillshare install` without a target prompts an interactive multi-select menu.
* [ ] The menu lists known agent targets: Claude, OpenCode, and Windsurf.
* [ ] Users can select one or multiple known agents from the list using arrow keys and spacebar.
* [ ] The prompt includes an "Other / Manual Target" option.
* [ ] Selecting the manual option asks the user to type a custom path or identifier.
* [ ] The installation completes successfully for all chosen targets.
* [ ] Supplying a target argument via the CLI bypasses the interactive prompt entirely.