# Renderer and Loop Patterns

## Table of Contents

- Renderer Selection
- WebGPU/WebGL Initialization
- Render Loop Patterns
- On-Demand Rendering
- Adaptive DPR
- Renderer Flags

## Renderer Selection

Use a profile-first selection strategy:

- Prefer `WebGPURenderer` for new work when available.
- Rely on fallback behavior when WebGPU is unavailable.
- Keep compatibility checks for advanced features.

Do not use deprecated renderer methods in new guidance.

## WebGPU/WebGL Initialization

```js
import { WebGPURenderer } from "three/webgpu";

const renderer = new WebGPURenderer({
  antialias: false,
  powerPreference: "high-performance",
});
await renderer.init();
```

Use `forceWebGL: true` only for explicit fallback testing or compatibility debugging.

## Render Loop Patterns

Prefer `setAnimationLoop` for continuous rendering cases:

```js
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
```

Avoid recommending deprecated async render loop APIs.

## On-Demand Rendering

Use on-demand rendering for mostly static scenes.

Vanilla pattern:

```js
let renderRequested = false;

function render() {
  renderRequested = false;
  renderer.render(scene, camera);
}

function requestRenderIfNotRequested() {
  if (renderRequested) {
    return;
  }

  renderRequested = true;
  requestAnimationFrame(render);
}
```

Hook this to input/resize/loading events.

R3F pattern:

```jsx
<Canvas frameloop="demand" />
```

```jsx
const { invalidate } = useThree();
controls.addEventListener("change", invalidate);
```

If damping is enabled, request frames through a guard to avoid redundant scheduling.

## Adaptive DPR

Use adaptive DPR when frame stability drops.

R3F example:

```jsx
<PerformanceMonitor
  onIncline={() => setDpr(2)}
  onDecline={() => setDpr(1)}
  flipflops={3}
  onFallback={() => setDpr(1)}
/>
```

Treat DPR changes as one tool, not a complete fix.

## Renderer Flags

Set renderer flags by requirement, not cargo cult defaults:

- Disable `alpha` if transparent canvas is not required.
- Disable `stencil` when unused.
- Keep `depth` enabled unless the rendering model proves otherwise.
- Choose antialiasing strategy by profiling native MSAA vs post AA.

When using postprocessing, re-check final color-space and tone-mapping pipeline correctness.
