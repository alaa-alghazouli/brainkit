# Assets and Loaders

## Table of Contents

- Asset Strategy
- CLI Pipeline
- Loader Wiring
- Compression Choices
- Loading UX

## Asset Strategy

Prefer glTF/GLB for runtime delivery.

Apply optimizations in this order:

1. Remove unnecessary geometry and textures at source.
2. Compress geometry (Draco or Meshopt).
3. Compress textures (KTX2 Basis ETC1S or UASTC).
4. Verify visual quality and decode cost on target devices.

## CLI Pipeline

Use inspection before optimization:

```bash
gltf-transform inspect input.glb
```

Use a baseline optimization pass:

```bash
gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp
```

Use KTX2 workflows when GPU texture compression is needed:

```bash
gltf-transform etc1s input.glb output-etc1s.glb
gltf-transform uastc input.glb output-uastc.glb
```

For R3F projects, consider:

```bash
npx gltfjsx model.glb -S -T -t
```

## Loader Wiring

Configure shared loaders once and reuse instances:

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";

const draco = new DRACOLoader().setDecoderPath("/draco/");
const ktx2 = new KTX2Loader()
  .setTranscoderPath("/basis/")
  .detectSupport(renderer);

const gltfLoader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx2);
```

Important loader rules:

- Call `detectSupport(renderer)` before KTX2 loads.
- Reuse decoder/transcoder instances to avoid repeated startup overhead.
- Dispose loader internals when the loader is no longer needed.

## Compression Choices

Use content-aware defaults:

- ETC1S: smaller files, higher compression artifacts.
- UASTC: higher quality, larger files.

Evaluate Draco vs Meshopt per project:

- Draco often yields strong geometry compression.
- Meshopt may decode faster in some scenarios.

Always compare:

- Network transfer size.
- Decode/transcode time.
- Runtime memory.
- Visual quality.

## Loading UX

Improve startup behavior:

- Preload only above-the-fold critical assets.
- Lazy-load offscreen 3D sections.
- Use placeholder or low-detail proxies while heavy assets load.
- Stream or chunk large worlds instead of one monolithic load.

Treat loading optimization as performance work, not only UX polish.
