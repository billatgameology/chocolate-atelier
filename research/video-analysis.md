# Chocolate latte-art video analysis

Source: Yoshitaka Muraoka / Chocolate Monster, Facebook reel 2648296818932398, approximately 60.44 seconds. The caption describes six chocolate-art creations and tags coffee, latte art and Monin Asia. The source was inspected directly, then downloaded for frame-by-frame comparison. Timing below is approximate and includes cuts between designs.

The visible medium is a pale latte foam surface with a tan coffee-colored perimeter in a red cup. Chocolate is dispensed from a narrow bottle nozzle. A single slender metal skewer manipulates it. No multi-tooth comb is shown. The video does not establish the beverage recipe, ingredient ratios, temperature, chocolate viscosity, exact tool diameter or depth. These cannot be inferred reliably from appearance alone.

## What actually creates the patterns

There are two different actions. Piping adds material: straight lines, concentric rings, outlined rectangles, hollow dots, oval loops, short bars and finishing dots. Etching moves existing chocolate and the neighboring foam. A pull through an outline creates a white channel flanked by chocolate; direction determines the tip and lobe orientation. Alternating radial directions creates pointed tips between broader petals. A path crossing many evenly spaced lines produces repeated scallops. A spiral crossing spokes creates a dense repeating whorl.

Spacing, line thickness and deposition order matter. The final design is not simply a decorative stamp: it retains the structure of the starting layout. The bright foam supplies the petal interiors, while chocolate mostly marks the boundaries. The artist adds small un-dragged dots at the end of the fourth piece to balance its outer areas.

## The six pieces

| Approx. time | Piped construction | Visible etching / finishing | Result and procedural recreation |
|---|---|---|---|
| 0:00–0:10 | Eight diameter strokes meeting at one center, producing about sixteen spokes. Endpoints hold slightly more chocolate. | A widening circular/spiral path crosses successive spokes. | Hooked crescents form concentric curved rows around a dense central whirl. The prototype uses 16 spokes and a 5.5-turn outward spiral; the exact original turn count and continuous path are not fully measurable. |
| 0:10–0:21 | Two large squares at different rotations, two smaller alternating squares, a center ring/dot, and short outer marks. | Radial strokes converge at the center, followed by additional pulls between earlier strokes. | Nested floral petals replace the overlapping geometric corners. The prototype uses eight inward pulls and eight interleaved outward pulls. This is a plausible reconstruction of the sequence, rather than a recovered exact tool path. |
| 0:21–0:30 | Two large concentric rings, two small inner rings, and a center dot. | Repeated inward pulls create rounded/scalloped sectors; outward pulls between them sharpen the intermediate tips. | Large pale petals, dark double outlines, and a small central flower. This is the clearest example of the same simple construction producing a complex result. |
| 0:30–0:42 | Two narrow perpendicular rectangular outlines, plus four small hollow circles on the diagonals. | The diagonal circles are pulled toward the center into paired lobes. The cross is further pulled into pointed arms. Groups of small finishing dots are added near the perimeter. | Four heart-like motifs alternate with four leaf-like points. The prototype reproduces the four-fold layout and hollow-circle dragging; rectangle curvature and lobe fullness remain approximate. |
| 0:42–0:50 | Two crossing diagonals with evenly spaced connecting bars in two opposite triangular sectors. Additional short straight lines are added in the empty sectors after the fan work. | Pulls across the bar groups form rows of scallops. A looping skewer path manipulates each added straight line into a chain of loose curls. | Two opposing feathered fans with curled accents. The prototype rotates the overall construction into a symmetric top view; fan sectors and looping curls are individually calibrated; exact physical fullness remains approximate. |
| 0:50–1:00 | Two long narrow oval outlines crossing perpendicularly, with three short strokes in each diagonal quadrant. | The oval tips are drawn outward into points; the diagonal stroke groups are pulled into branching sprigs. | Four hollow pointed leaves alternating with four small sprigs. The prototype preserves the construction and symmetry; its dash bars now cross the diagonal spine at successive radial positions, producing branching sprigs. |

The descriptive names used by the studio—Spiral rosette, Square mandala, Ring bloom, Heart cross, Feathered fans and Four-leaf flourish—are app labels, not verified artist titles.

## Why this web implementation

SVG or a collection of fixed final shapes would make attractive previews, but a freehand skewer must respond to whatever the user has piped. A two-dimensional material field lets the same operator deform rings, arbitrary handwriting and dots. A full fluid solver is unnecessary for the first editor: the video’s interesting behavior is controlled tool motion, while the design stays almost still when the tool lifts.

The current engine stores chocolate and foam as Float32 grids at 512 × 512. A pipe is a sweep of antialiased circular deposits. Each skewer step defines a displacement parallel to motion, weighted by distance from the short tool segment. Inverse sampling looks up the previous material at the displaced position; bilinear interpolation avoids checkerboard steps. Each affected region is copied before writing, preventing feedback from already-updated neighboring pixels. Cup clipping prevents pigment from entering the ceramic rim. Optical-density mapping keeps low-concentration chocolate legible.

Pointer Events support mouse, pen and touch. A fixed normalized 2px reference step, with distance carried across incoming events, avoids extra simulation passes from densely sampled collinear input. The same sampler drives recipe replay. Operations compile their spatial steps once, and animation applies them in order; a frame does not recreate or resample the path. A whole gesture is one undo operation. Optional WebMCP tools expose recipe selection and bounded normalized strokes for an agent using the editor.

CPU Canvas keeps the first version portable and dependency-free. WebGL texture/framebuffer ping-pong is the appropriate next step for higher resolution, larger brush footprints or more complex fluids. A GPU port should preserve untouched pixels and use a corrected advection scheme before adding diffusion; otherwise thin chocolate will vanish faster. Higher resolution alone does not establish physical accuracy.

## The intended interface

The cup is the main working surface. Users can begin from a finished example, inspect the piped base, replay the method, or start blank. Three tools correspond to visible actions: Drop, Pipe and Drag. One width control changes the active tool. Optional rotational repetition lets beginners create balanced floral patterns with one gesture. Radial guides help align strokes. Original/recreation comparisons teach the connection between seed geometry and outcome without hiding fidelity gaps.

A beginner flow is: select Ring bloom → Piped base → Drag → pull a ring inward → undo if needed → enable 8-fold rotation → try another stroke. Freehand piping remains available rather than confining users to presets.

## Limits and validation

The original camera looks obliquely at the cup; the app uses an orthographic top view. Pixel comparison would require perspective correction and consistent lighting. The video also cuts and changes tools/cups, so there is insufficient evidence to recover precise physical parameters. Recipes are deterministic procedural approximations of all six designs. Repeated resampling still smooths thin chocolate; local Gaussian displacement is not divergence-free or mass-conserving. There is no claim of fluid-dynamics validation.

Automated checks passed for blank-skewer pigment invariance, dense/sparse collinear input equivalence, exact state restore, cup clipping, finite recipe state and visible chocolate. A DOM/native Canvas smoke test passed for all recipe stages, undo/redo, comparisons, pointer gestures, rotational guides, replay/pause/step, PNG export and browser tools. Additional tests verify exact progressive/immediate parity for chocolate and foam in all six recipes, a visibly partial spiral, pause/resume, single-step boundaries, capped elapsed time after long frames and stale-frame cancellation. Live browser verification and layout screenshots supplement the deterministic checks.

Useful primary technical references: NVIDIA GPU Gems, “Fast Fluid Dynamics Simulation on the GPU” (inverse advection and numerical diffusion); MDN Pointer Events, getCoalescedEvents, setPointerCapture and WebGL framebufferTexture2D documentation. These support the implementation principles, not claims about the artist’s recipe.
