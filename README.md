# CURTAIN LAB — Fabric in Motion

An immersive 3D curtain studio. Not a conventional product grid: visitors can interact with fabric, explore material behavior, tune daylight and configure a made-to-measure curtain.

## Product experience

- **Interactive room** — a full-screen architectural interior with a large window and two independently rendered curtain panels.
- **Fabric interaction** — pointer/touch drag deforms the curtain mesh in 3D space. The response is continuous and damped rather than a CSS panel translation.
- **Material library** — Sheer, Linen, Velvet and Blackout profiles with different color, opacity, roughness, sheen and fold response.
- **Wind studio** — still air, light breeze, breeze and strong wind.
- **Daylight studio** — time-of-day control from 08:00 to 22:00, changing scene lighting.
- **Made to measure** — width, height, quantity and estimated area-based pricing.
- **Shopping bag** — add the current configuration and review the selection.

## Stack

- React + TypeScript + Vite
- Three.js via React Three Fiber
- Drei for scene helpers
- Zustand for shared studio state
- GSAP dependency available for future transition choreography

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deployment

GitHub Actions builds the Vite app and deploys the generated `dist/` directory to GitHub Pages.

## Current implementation notes

The curtain is a subdivided Three.js mesh whose vertices are updated continuously for fabric folds, wind response and local pointer interaction. This is an interactive real-time deformation model, not a full cloth solver: self-collision, collision against the window frame, physically based fabric testing and calibrated 60fps profiling remain future engineering work.

The shopping bag and price are a front-end prototype; there is no checkout, inventory or order backend.
