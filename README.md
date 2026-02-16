# Bellini — Landing Hornos Industriales

Landing de una sola página con **scrollytelling** para una empresa de hornos industriales. Next.js 14 (App Router), React, TypeScript, Tailwind CSS y GSAP + ScrollTrigger.

## Estructura

- **Hero** — Video de fabricación fullscreen, fade out al hacer scroll.
- **Producto** — Rotación 360° controlada por scroll, ancla en posición frontal, features con stagger.
- **Corte transversal** — Exploded view con capas y labels animados.
- **Especificaciones** — Grid de métricas con count-up.

## Cómo correr

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Assets

- **Video hero:** Colocar `fabricacion.mp4` en `public/videos/fabricacion.mp4`. Si no existe, el hero muestra fondo negro y texto.
- **Secuencia 360°:** Para rotación por imágenes, colocar 72 frames en `public/images/oven-360/` como `oven_001.jpg` … `oven_072.jpg`. Si no existen, se usa la imagen única `oven.jpg` con rotación 3D, o el placeholder SVG `oven.svg` (renombrar a `oven.jpg` o referenciar desde el código).
- **Placeholder actual:** En `public/images/oven-360/` hay un `oven.svg`. Para usar una sola imagen con efecto 360°, renombrar a `oven.jpg` o añadir `oven.jpg` (foto del horno) y el componente usará ese asset en modo fallback.

## Ajustes

- **Duración del scroll del producto:** En `components/ProductScroll.tsx`, variable `totalScrollLength` (píxeles de scroll para completar los 360°).
- **Número de frames:** En el mismo archivo, `FRAME_COUNT` y `FRAME_PREFIX`.
- **Colores / tipografía:** `tailwind.config.ts` y `app/globals.css` (industrial black, accent, etc.).
