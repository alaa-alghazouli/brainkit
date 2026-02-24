# Skill Reference

## Skill identity

- Name: `threejs-performance-optimizer`
- Artifact: `skill-artifacts/threejs-performance-optimizer.skill`

## Trigger intent

Use for requests about:

- low FPS, frame drops, stutter/jank
- high draw calls or expensive rendering paths
- Three.js or R3F memory leaks/disposal problems
- mobile 3D performance bottlenecks
- GLB/texture loading and compression optimization
- on-demand rendering and invalidate patterns

## Optimization contract

Every optimization output should include:

1. Bottleneck diagnosis
2. Ordered action plan
3. Risk and compatibility notes
4. Verification criteria and expected metric movement

## Reference modules

- `skills/threejs-performance-optimizer/references/performance-workflow.md`
- `skills/threejs-performance-optimizer/references/renderer-and-loop-patterns.md`
- `skills/threejs-performance-optimizer/references/assets-and-loaders.md`
- `skills/threejs-performance-optimizer/references/draw-calls-materials-lighting.md`
- `skills/threejs-performance-optimizer/references/memory-and-disposal.md`
- `skills/threejs-performance-optimizer/references/r3f-rules.md`
- `skills/threejs-performance-optimizer/references/outdated-guidance.md`

## Guardrails

- Prefer current official docs over old snippets.
- Avoid deprecated renderer/API recommendations.
- Treat hard thresholds as context-dependent heuristics.
- Avoid blanket statements without measurement.
