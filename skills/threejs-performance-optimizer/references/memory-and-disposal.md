# Memory and Disposal

## Table of Contents

- Disposal Rules
- Cleanup Patterns
- Update Flags
- Bounding Volumes
- Leak Detection

## Disposal Rules

Removing an object from a scene does not free GPU resources.

Explicitly dispose resources no longer needed:

- `BufferGeometry.dispose()`
- `Material.dispose()`
- `Texture.dispose()`
- `WebGLRenderTarget.dispose()`
- `Skeleton.dispose()` for unused shared skeletons

If texture data uses `ImageBitmap`, close CPU-side data explicitly:

```js
texture.source.data.close?.();
texture.dispose();
```

## Cleanup Patterns

Use a traversal cleanup utility for scene teardown:

```js
function disposeScene(root) {
  root.traverse((obj) => {
    if (obj.geometry) {
      obj.geometry.dispose();
    }

    if (!obj.material) {
      return;
    }

    const materials = Array.isArray(obj.material)
      ? obj.material
      : [obj.material];
    for (const material of materials) {
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && value.isTexture) {
          value.dispose();
        }
      }
      material.dispose();
    }
  });
}
```

Dispose loader internals or worker resources when loader lifecycle ends.

## Update Flags

Use update flags only when required:

- Buffer attribute changes: `attribute.needsUpdate = true`
- Texture content changes: `texture.needsUpdate = true`
- Material feature or define changes: `material.needsUpdate = true`

For static objects, disable automatic matrix updates:

```js
object.matrixAutoUpdate = false;
object.updateMatrix();
```

## Bounding Volumes

Recompute bounds after structural data updates:

- Geometry vertex changes: `computeBoundingBox()` and `computeBoundingSphere()`
- Instanced transforms update: `instancedMesh.computeBoundingBox()` and `computeBoundingSphere()`

Accurate bounds protect culling and interaction correctness.

## Leak Detection

Track `renderer.info` over repeated scene mount/unmount cycles:

- `renderer.info.memory.textures`
- `renderer.info.memory.geometries`
- `renderer.info.programs`

Stable plateaus are normal. Monotonic growth under repeated teardown/rebuild indicates leaks.
