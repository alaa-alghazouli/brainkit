# Outdated Guidance Guardrails

Use this table to avoid stale recommendations.

| Avoid this guidance                                         | Why                                   | Use this instead                                                          |
| ----------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| "Use `renderAsync()` in the main loop"                      | Deprecated in current renderer docs   | Use `setAnimationLoop()` with `render()` and explicit compute workflow    |
| "Use `gammaFactor` / `outputEncoding` as default advice"    | Legacy color pipeline terminology     | Use current color-space workflow and current renderer properties          |
| "`Geometry` / `BoxBufferGeometry` naming as modern default" | Legacy naming and old-era examples    | Use current geometry APIs and confirm version-specific docs               |
| "All textures must be power-of-two"                         | Too absolute for modern contexts      | Prefer POT for compatibility/perf-sensitive paths; profile and validate   |
| "Always disable native MSAA and use FXAA/SMAA"              | Highly scene/device dependent         | Compare native AA vs post AA using measurements                           |
| "Always keep under 100 draw calls"                          | Useful heuristic, not universal rule  | Use target-device budgets and verify frame stability                      |
| "Removing mesh from scene frees memory"                     | Incorrect resource lifecycle model    | Explicitly call `dispose()` on geometry/material/texture/targets          |
| "Use React state for per-frame animation"                   | Causes re-render overhead and jank    | Mutate refs in `useFrame`, use state for coarse events                    |
| "Always migrate to WebGPU now"                              | Context-dependent project constraints | Evaluate project requirements, browser/device support, and measured gains |

## Source Confidence Priority

Prefer recommendations in this order:

1. Current official docs and API reference.
2. Official manuals and examples.
3. Community articles and blog heuristics.

When community advice conflicts with official docs, prioritize docs and annotate the conflict.
