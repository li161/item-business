# CURTAIN LAB — Fabric in Motion

A full-screen, interactive 3D curtain studio. This is not a conventional product catalogue: the curtain is the interface.

## Rebuilt foundation

- React + TypeScript + Vite
- Three.js through React Three Fiber
- Zustand studio state
- A real subdivided cloth mesh with Verlet-style integration, structural/shear/bend constraints, wind forces and local pointer influence
- Independent left/right curtain panels
- Four fabric profiles with distinct opacity, roughness, sheen, weight and wind response
- Continuous daylight and interior-light control
- Made-to-measure estimate and local shopping-bag prototype

## Run locally

```bash
npm install
npm run dev
```

## Verify production build

```bash
npm run build
npm run preview
```

## GitHub Pages

The app is configured for the repository path `/item-business/`. The Pages workflow deploys the Vite `dist/` output from `main`.

## Engineering limits

The cloth uses a real-time Verlet/PBD-style mesh simulation with top-edge constraints and local grab forces. It is not a research-grade cloth solver: self-collision, calibrated fabric coefficients, collision against the window frame, and device-by-device 60 FPS profiling remain future work. The shopping bag is a front-end prototype and does not process payments or persist orders remotely.
