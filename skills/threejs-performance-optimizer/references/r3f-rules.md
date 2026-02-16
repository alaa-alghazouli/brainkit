# React Three Fiber Rules

## Table of Contents

- Frame Loop Discipline
- Resource Reuse
- Rendering Policy
- Adaptive Quality
- Strict Anti-Patterns

## Frame Loop Discipline

Use mutation in `useFrame` for high-frequency updates.

```jsx
const ref = useRef();

useFrame((_, delta) => {
  ref.current.rotation.y += delta;
});
```

Use `delta` for frame-rate independence.

Avoid `setState` in `useFrame` or any high-frequency event loop.

## Resource Reuse

Reuse geometry/material instances and loaded assets:

- Use `useLoader` for cached resource loading.
- Use memoization for reusable Three.js objects.
- Prefer visibility toggles over frequent mount/unmount churn.

Example:

```jsx
const geometry = useMemo(() => new THREE.BoxGeometry(), []);
const material = useMemo(() => new THREE.MeshStandardMaterial(), []);
```

## Rendering Policy

For mostly static scenes:

```jsx
<Canvas frameloop="demand" />
```

Trigger renders when external mutations happen:

```jsx
const { invalidate } = useThree();
invalidate();
```

Attach controls change events to invalidate when needed.

## Adaptive Quality

Use `PerformanceMonitor` or equivalent to adapt quality:

- Lower DPR on decline.
- Disable expensive postprocessing first.
- Apply fallback quality profile if repeated flip-flops occur.

Use transitions for expensive UI state updates:

```jsx
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setHeavyState(next);
});
```

## Strict Anti-Patterns

Avoid these patterns:

- `setState` inside `useFrame`.
- Per-frame object allocation (`new Vector3()` in hot path).
- Constant remounting of heavy 3D subtrees.
- Fast pointer-driven transforms through React state.
- Unbounded postprocessing and DPR at all times.
