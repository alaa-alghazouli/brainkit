# Performance Workflow

## Table of Contents

- Baseline Checklist
- Bottleneck Classification
- Priority Matrix
- Verification Template

## Baseline Checklist

Capture these values before touching code:

- Runtime profile: FPS and frame-time variance (average and worst spikes).
- Renderer stats: `renderer.info.render.calls`, triangles, and points.
- Memory trend: `renderer.info.memory.textures`, geometries, and programs.
- Startup profile: bundle size, model size, texture payload, decode/transcode duration.
- Device context: desktop/mobile, GPU class, browser, resolution, DPR.

Use at least one user interaction scenario and one idle scenario.

## Bottleneck Classification

Use this decision path:

1. Check profiler for long JS tasks or React re-render churn.
2. Check draw calls, shader complexity, light/shadow/post stack cost.
3. Check memory growth over time in repeated navigation or scene swaps.
4. Check network/decode/transcode delays before first interactive frame.

Interpretation guide:

- CPU-bound indicators:
  - Frequent long tasks.
  - Per-frame allocations.
  - High-frequency state updates.
- GPU-bound indicators:
  - High draw calls.
  - Heavy transparency, postprocessing, shadow passes.
  - Lower FPS with high DPR and dense scene content.
- Memory-bound indicators:
  - Steadily growing texture/geometry counts.
  - Context loss or large spikes during scene transitions.
- Load-time bound indicators:
  - Long time-to-first-render.
  - Large GLB and texture payloads.
  - Decoder/transcoder setup errors or delays.

## Priority Matrix

Apply fixes in this order unless measurements suggest otherwise.

1. Asset pipeline:
   - Compress geometry and textures.
   - Remove unused assets.
   - Preload only critical resources.
2. Draw-call pressure:
   - Instancing and batching.
   - Merge static geometry.
   - Share materials.
3. Render-loop policy:
   - On-demand rendering where possible.
   - Adaptive DPR and quality scaling.
4. Shading and lighting:
   - Reduce dynamic lights/shadows.
   - Tighten shadow frustums and map sizes.
   - Trim postprocessing passes.
5. Memory lifecycle:
   - Dispose obsolete resources.
   - Reuse pooled objects.

Heuristic budgets (starting points only):

- Draw calls: aim for a few hundred or less on typical target hardware.
- Dynamic shadowed point lights: keep minimal, each adds substantial pass cost.
- DPR on mobile: cap aggressively when frame stability drops.

Do not treat these as hard rules. Validate against project goals.

## Verification Template

Use this response structure after each optimization pass:

- Baseline:
  - FPS/frame time:
  - Draw calls:
  - Memory counters:
- Change applied:
  - What changed:
  - Why it targets the bottleneck:
- Result:
  - New FPS/frame time:
  - New draw calls:
  - Memory delta:
- Tradeoffs:
  - Visual impact:
  - Compatibility risk:
  - Complexity cost:
- Keep or rollback decision:
