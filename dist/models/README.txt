Brain line drawing geometry

Source: fsaverage5 left/right pial surfaces distributed with Nilearn 0.10.4.
https://github.com/nilearn/nilearn/tree/0.10.4/nilearn/datasets/data/fsaverage5
License: LICENSE-nilearn.txt (BSD). Original average template: FreeSurfer fsaverage5.

The two hemispheres were combined, centered, reoriented and quantized. The full
source mesh is retained at scripts/assets/cortex-source.bin. The optional
scripts/build-brain-folds.py (Python 3 + NumPy) derives smoothed fold curves from
mean curvature and a smaller mesh for visibility and silhouette calculations.
Normal npm builds and the browser do not require Python or NumPy.

cortex.bin (little endian): uint32 vertex count, uint32 index count; vertex count
* (3 int16 positions at scale 20000, 3 normalized int16 normals); uint16 indices.
The mesh only writes depth, never visible color. Its changing silhouette is drawn
using line strips. No filled cortical material is shown.

folds.bin: uint32 vertex count, followed by pairs of vertices (3 int16 positions
at scale 20000, 3 normalized int16 normals). Each pair describes a line segment.
Lines follow organic cortical folds; they are not horizontal cross-sections.

The colors and light pulses are artistic, not neural measurements or a scientific
connectivity map. The illustration makes no medical or diagnostic claim.
