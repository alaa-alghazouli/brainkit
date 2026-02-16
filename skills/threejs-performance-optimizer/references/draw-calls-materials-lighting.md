# Draw Calls, Materials, Lighting

## Table of Contents

- Draw Call Reduction
- Geometry Strategy
- Material Strategy
- Lighting and Shadows
- Postprocessing

## Draw Call Reduction

Treat draw-call reduction as a primary lever.

Use this escalation path:

1. Share materials and geometry where possible.
2. Use `InstancedMesh` for repeated objects.
3. Use batch or merged static geometry for non-interactive sets.
4. Use LOD and distance-based simplification.

Use draw-call budgets as heuristics, not hard guarantees. Validate on target devices.

## Geometry Strategy

For repeated meshes, prefer instancing:

```js
const mesh = new THREE.InstancedMesh(geometry, material, count);
for (let i = 0; i < count; i += 1) {
  mesh.setMatrixAt(i, matrix);
}
mesh.instanceMatrix.needsUpdate = true;
mesh.computeBoundingSphere();
```

For static scene chunks, consider merged geometry:

- Merge by material compatibility.
- Keep interactable parts separate.
- Avoid over-merging when per-object behavior is required.

## Material Strategy

Control shader variant explosion:

- Reuse shared material instances whenever possible.
- Avoid unnecessary feature toggles at runtime that trigger recompilation.
- Update uniforms/data values instead of replacing whole materials.

Prefer simpler materials where quality permits.

## Lighting and Shadows

Use dynamic lights selectively:

- Keep active shadow-casting lights minimal.
- Tighten shadow camera frustums.
- Use smallest acceptable shadow map sizes.
- Disable shadow auto-updates for static scenes and trigger only when needed.

Point-light shadow cost reminder:

- One point light shadow map requires six faces.
- Cost scales quickly with object count.

Prefer environment lighting and baked/static lighting when practical.

## Postprocessing

Treat each pass as measurable cost.

- Start with the minimal pass chain.
- Merge compatible effects when possible.
- Re-test antialiasing strategy per project.
- Reduce internal effect resolution when quality permits.

Avoid rigid recommendations like "always disable native AA" or "always use FXAA". Measure and choose.
