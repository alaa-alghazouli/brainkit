---
name: threejs-performance-optimizer
description: Optimize and refactor Three.js and React Three Fiber code for runtime performance, memory efficiency, loading speed, and rendering quality using a profile-first workflow grounded in current Three.js and R3F docs. Use when requests mention low FPS, frame drops, stutter/jank, high draw calls, heavy post-processing, shadow cost, large GLB/texture payloads, mobile 3D slowness, memory leaks, dispose/cleanup issues, WebGPU or WebGL fallback concerns, frameloop demand/invalidate patterns, instancing, batching, LOD, or general Three.js performance tuning.
---

# Threejs Performance Optimizer

Optimize performance by measurement, not folklore. Prioritize high-impact changes, preserve visual intent, and avoid stale APIs.

## Core Behavior

Follow this sequence every time:

1. Measure baseline first.
2. Classify the bottleneck (CPU, GPU, memory, or loading).
3. Apply one focused optimization pass.
4. Re-measure and keep only verified improvements.

Never start by rewriting everything. Prefer the smallest change that hits the biggest bottleneck.

## Reference Loading Order

Read references in this order and stop when enough context is collected:

1. `references/performance-workflow.md` for triage and reporting structure.
2. `references/renderer-and-loop-patterns.md` for render loop and renderer choices.
3. `references/assets-and-loaders.md` for asset and decoder/transcoder pipeline.
4. `references/draw-calls-materials-lighting.md` for scene/render cost tuning.
5. `references/memory-and-disposal.md` for leaks, cleanup, and update flags.
6. `references/r3f-rules.md` when code uses React Three Fiber.
7. `references/outdated-guidance.md` before finalizing recommendations.

## Mandatory Workflow

### 1) Measure

Collect at least:

- FPS or frame time trend.
- Draw calls and triangles (`renderer.info`).
- Memory trend for textures/geometries/programs.
- Main-thread and GPU hotspots from profiler.

If performance metrics are missing, request them or add lightweight instrumentation.

### 2) Classify

Classify the primary bottleneck before prescribing fixes:

- CPU-bound: heavy JS/React work, allocations, simulation, or scene graph churn.
- GPU-bound: high draw call count, expensive shaders/lights/shadows/postprocessing.
- Memory-bound: growing texture/geometry/render-target counts, context pressure.
- Load-time bound: large payloads, slow decode/transcode, blocking startup work.

### 3) Fix in ROI Order

Use this order unless data proves otherwise:

1. Asset payload and decode pipeline.
2. Draw call reduction (instancing, batching, static merges).
3. Render loop policy (on-demand and adaptive DPR where suitable).
4. Lighting/shadow/postprocessing cost.
5. Memory lifecycle and disposal correctness.

### 4) Verify and Report

Report:

- What changed.
- Expected impact.
- Measured before/after.
- Tradeoffs and rollback criteria.

## Non-Negotiable Rules

- Prefer official, current APIs over old blog snippets.
- Treat hard numeric targets as heuristics, not universal truths.
- Keep static scenes from rendering continuously when not needed.
- Avoid per-frame object allocation in hot paths.
- Explicitly dispose resources no longer needed.
- Keep anti-aliasing strategy profile-driven, not dogmatic.

## Hard Anti-Rules

- Do not use deprecated renderer APIs in recommendations.
- Do not claim guaranteed multipliers (2x, 10x) without measurement.
- Do not assume removing from scene frees GPU memory.
- Do not use React state updates for per-frame animation.
- Do not force one compression or AA approach for all projects.

## Output Contract

When delivering optimization advice or edits, always include:

1. Bottleneck diagnosis.
2. Ordered action plan.
3. Risk notes (visual quality, compatibility, complexity).
4. Verification steps and expected metrics movement.

Keep recommendations practical, testable, and version-safe.
