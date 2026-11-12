# Orbit

An interactive portfolio hero: my Dribbble shots arranged on a spinning 3D globe. Click a card and the camera dives in as the shot expands into view.

**Live:** https://orbit-tau-puce.vercel.app

## How it works

- Plain HTML, CSS and vanilla JavaScript — no frameworks, no WebGL.
- 77 cards sit in 7 latitude rings, placed with CSS 3D transforms (`rotateY → rotateX → translateZ`).
- One `requestAnimationFrame` loop drives the idle spin, cursor tilt, drag inertia and depth fog.
- Opening a shot rotates the globe the shortest way to the card, pushes it toward the camera, and grows a lightbox from the card's live on-screen position.
- Keyboard: ← → to step through shots, Esc to close. Respects `prefers-reduced-motion`.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Credits

Inspired by the work of [Viktor Oddy](https://x.com/viktoroddy).

## License

The code is MIT licensed: feel free to learn from it and reuse it. The shots and images in `assets/` are my own design work and are not covered by the license; please swap in your own. See [LICENSE](LICENSE).

## Files

- `index.html` — markup and corner copy
- `style.css` — layout, globe, lightbox and pill styles
- `main.js` — shot list, globe layout, animation loop and interactions
- `assets/shots/` — shots in `-md` (globe) and `-lg` (lightbox) sizes
