# Bellini — Landing Hornos Industriales

Landing de una sola página para una empresa de hornos industriales. Next.js 14 (App Router), React, TypeScript, Tailwind CSS y GSAP + ScrollTrigger.

## Estructura

- **Hero** — Slider automático de imágenes de panadería, overlay oscuro, texto centrado.
- **Producto** — Narrativa por scroll: texto → imagen estática del horno → características (sin rotación 3D).
- **Línea** — Cuatro modelos: Convector 4/8 bandejas, Rotativo 10/15 bandejas.
- **Especificaciones** — Bloque “Métricas y rendimiento” (clientes, presencia regional).
- **Proceso** — Sección de proceso.
- **Testimonios** — Testimonios de clientes.
- **Contacto** — Formulario de contacto.
- **WhatsApp** — Botón flotante a chat (número editable en `components/WhatsAppFloat.tsx`).

## Cómo correr

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Build para producción

```bash
npm run build
npm start
```

## Assets utilizados

- **Hero:** Imágenes en `public/images/hero-bakery/` (bakery_01.png … bakery_06.png).
- **Producto:** Imagen principal en `public/images/assets/Bellini_hornoprincipal.png`.
- **Línea:** Imágenes en `public/images/lineup/`: convector-4-bandejas.png, convector-8-bandejas.png, rotativo-10-bandejas.png, rotativo-15-bandejas.png.
- **Logo / icono:** `public/images/assets/bellini_logo_fondo_negro.png`, `bellini_icono_fondo_negro%20-%20copia.png`.

## Ajustes frecuentes

- **WhatsApp:** Número en `components/WhatsAppFloat.tsx`, constante `WHATSAPP_PHONE` (formato Argentina: 549 + área + número).
- **Duración del pin del producto:** En `components/ProductScroll.tsx`, constante `PIN_SCROLL_LENGTH`.
- **Colores / tipografía:** `tailwind.config.ts` y `app/globals.css`.
