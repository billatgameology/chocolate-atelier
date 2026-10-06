# Chocolate Atelier

A standalone browser studio inspired by Yoshitaka Muraoka’s six-piece chocolate latte-art reel. No application login, API key, backend, or dependency installation is needed to run the editor.

**Open the studio:** https://billatgameology.github.io/chocolate-atelier/

## Publishing updates

This repository publishes the `public/` folder to GitHub Pages. Every push to `main` runs the syntax checks and engine tests, then deploys the site if they pass. Deployment progress is available in the repository's **Actions** tab.

After editing and previewing locally, run:

```sh
git add public README.md
git commit -m "Update Chocolate Atelier"
git push
```

The GitHub repository's **Settings → Pages → Source** must be set to **GitHub Actions**. The workflow is in `.github/workflows/pages.yml` and follows [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Visitors can use the public site without signing in.

## Run locally

From this folder, run `npm start` (Python 3), then open http://127.0.0.1:4173. Alternatively serve `public/` with any static HTTP server. ES modules require HTTP rather than opening index.html directly.

## Use

Choose one of six recipes. Switch between the piped base and finished art. Replay draws each line and skewer pull progressively, following a visible tool tip. It defaults to slow ½× playback, with 1× and 2× options. Pause preserves a partial stroke; Finish stroke animates its remainder, and Next stroke animates one subsequent command. Use Drop, Pipe or Drag to make your own composition. Rotation repeats your gesture 2, 4 or 8 times. Undo and redo work on whole gestures. Save image exports a 1200px PNG using the current 512px surface; this enlarges the raster rather than adding simulated detail.

“Study the reel” provides original stills, procedural recreations, observed technique notes and model limitations. Recipe names are descriptive labels created for this app, not titles from the artist.

## Rendering

Canvas 2D presents two Float32 material fields: chocolate concentration and pale foam. Piping deposits concentration. A moving skewer applies a local Gaussian directional displacement and inverse bilinear sampling from an immutable region snapshot. Normalized spatial resampling carries a residual across pointer events, so additional collinear pointer samples do not introduce extra advection passes. The optical-density curve preserves visible thin chocolate. The field is clipped to the circular foam surface.

This is an artistic material-deformation model. It does not conserve fluid mass or solve viscosity, surface tension, foam bubbles, tool depth or thermal behavior. Fine features still soften after repeated pulls; six recipes are procedural approximations, not pixel-matched copies. A WebGL implementation with correction for advection diffusion would be the next rendering improvement once the stroke paths and interaction are approved.

## Validation

`npm run check` checks module syntax. `npm test` verifies no chocolate appears from a blank skewer, dense/sparse straight strokes agree, snapshot restore is exact, chocolate stays within the cup, and all six recipes retain finite state and visible chocolate. It also checks exact final-state agreement between progressive and immediate execution for every recipe, a partial spiral, pause/resume, single-stroke stepping, hidden-tab time capping and cancellation of queued frames.

A temporary JSDOM + native Canvas interaction test also verified recipe switching, piped/finished stages, whole-gesture undo/redo, original comparison text, blank cup, pointer input including empty coalesced events, symmetry, replay/pause/step, PNG export and WebMCP action tools. Live browser validation covers progressive piping and the spiral at a partial 21% state, pause/resume, stepping, desktop layout and the 390px phone layout with no page overflow. Screenshots are saved in `research/`.

## Files

- `public/engine.js`: surface state, deposition, inverse advection and normalized sampling.
- `public/recipes.js`: observed recipe notes and executable commands.
- `public/operations.js`: fixed spatial operation samples and progressive replay controller.
- `public/app.js`: editor, history, replay controls, export and optional browser tools.
- `research/video-analysis.md`: detailed video breakdown and implementation reasoning.
- `research/comparison.png`: original versus recreation for all six artworks.

Source: https://www.facebook.com/reel/2648296818932398/
