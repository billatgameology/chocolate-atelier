# Comparison and replay refinement — 30 September 2026

The previous and updated recreations were compared against all six original frame crops. Camera perspective, overall rotation, cup lighting and foam texture are excluded from shape judgments: the app is a top view, while the reel is oblique. Changes are calibrated artistic approximations, not measured fluid parameters.

| Design | Difference in the previous recreation | Implemented correction | Remaining difference |
|---|---|---|---|
| Spiral rosette | Spoke crossings formed angular hooks with flat shoulders. | Widened spiral influence from 5.32 to 8.36 reference pixels; strength from .78 to 1.08. Extended the Gaussian shoulder from 2.5 to 4 radii, removing its visible cutoff. Tapered the radius near the center. The same 16 spokes and 5.5-turn spiral now form rounded crescents. | Original chocolate varies in thickness and contains small asymmetric pools. |
| Square mandala | Oversized dark center; geometric edges survived too strongly. | Smaller inner squares/ring; softer drag shoulder; fine center influence. The outward strokes begin at radius .13, outside the central motif, so they preserve its inner petal structure. | The original outer corners and central details have more irregular curved folds. |
| Ring bloom | Dark central star overwhelmed the smaller flower. | Reduced inner ring radii, tapered center drag, and moved outward stroke starts to radius .15. Inward pulls now leave a rounded inner flower which the outer pulls preserve. | The original chocolate outlines are thicker in places, and its center has uneven tiny lobes. |
| Heart cross | Hollow circles collapsed into thin slits; rectangle corners and small dots were too sharp/small. | Larger, thicker hollow circles; inward strength .9 for longer paired tails; rounded rectangle corners; larger accent dots; separately tuned outward pull width/strength. | The four main arms retain straighter side walls and a more open junction than the original floral folds. |
| Feathered fans | Fan sectors were too narrow; accent curls were alternating S bends. | Widened sectors toward 90°. Replaced the wave with four inward looping trochoid turns, radius 3.3 and strength 1.1. These deform a straight piped stem into hollow curls; no decorative final shapes are stamped on. | Fan cells remain more regular and its curls have faint trailing material. |
| Four-leaf flourish | Three detached radial strokes appeared instead of connected sprigs. | Placed three short transverse bars at successive radii along each diagonal spine; inward pulling joins them into branches. Refined central endpoints and outline pulls. | The original terminal droplets are fuller and its leaf sides more curved. |

The optical-density coefficient changed from 10 to 8 to reduce the dark appearance of repeatedly diluted material. This changes presentation, while all deformation still acts on the chocolate and foam fields. Freehand dragging receives the same softened kernel and a stronger pull, so the rounded effect is available to users as well as presets.

## Progressive replay

Previously the editor applied an entire command, rendered its final result, then waited before the next command. The spiral was one command, so its complete circular deformation appeared in a single update.

`OperationRunner` compiles the pipe deposits or fixed skewer segments once. `RecipeReplay` advances by elapsed time and applies only the next spatial samples. Piped lines grow tip-to-tail; skewer strokes change the existing material under a moving tool marker; dots grow briefly. A ½× default gives the spiral pull roughly twelve seconds rather than one instantaneous update. Speed controls affect timing only.

Pause holds the partial material state. Finish stroke animates the rest of the current command, then pauses. Next stroke animates one whole subsequent command. Resume continues from the same sample. Cancellation invalidates queued frames, and elapsed time per frame is capped at 60ms so returning from a hidden tab cannot complete the spiral in one jump. A replay is one undo action.

Rendering caches the static cup mask, light texture and image buffer; the per-frame work blends the evolving material fields. This supports continuous CPU Canvas playback without adding application dependencies.

## Evidence

- `comparison.png`: all six updated recreations beside their unchanged reference crops.
- `spiral-refinement.png`: original, previous and updated spiral shape.
- Automated tests compare every Float32 element after gradual versus immediate execution of all six recipes; both fields match exactly.
- Controller checks cover partial progression, uneven frame batches, pause/resume, single-command stepping, long-frame capping and stale-frame cancellation.
- DOM/native Canvas checks cover recipe switching, history, pointer gestures, symmetry, comparison content, replay controls, PNG export and browser tools.
- Live browser checks supplement those tests with actual progressive piping and replay behavior. Desktop and phone screenshots are retained in this folder.
