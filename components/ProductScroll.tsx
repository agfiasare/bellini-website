"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Imagen del producto principal (sección Producto). */
const OVEN_IMAGE_SRC = "/images/assets/Bellini_hornoprincipal.png";

/** Criterios de diseño: título + descripción técnica */
const DESIGN_CRITERIA = [
  {
    title: "Estabilidad térmica",
    description:
      "Distribución homogénea de temperatura y control preciso para resultados repetibles en cada ciclo.",
  },
  {
    title: "Robustez estructural",
    description:
      "Estructura y materiales pensados para operación continua y vida útil prolongada en planta.",
  },
  {
    title: "Operación confiable",
    description:
      "Diseño que prioriza mantenimiento predecible y bajo impacto en la línea de producción.",
  },
];

/** Scroll total durante el pin (px). Ajustar para más/menos “tiempo” en cada estado. */
const PIN_SCROLL_LENGTH = 3200;
/** Breakpoint (px) para desktop vs mobile. */
const DESKTOP_BP = 768;
/** Margen superior mínimo (px) para que el texto no quede bajo el navbar (h-16 ≈ 64px + respiro). */
const NAVBAR_OFFSET_PX = 80;

/**
 * Bloque Producto: narrativa por scroll (sin rotación).
 * Desktop: texto → texto sube → imagen horno → layout imagen derecha + características izquierda.
 * Mobile: columna (texto, imagen, características) con fade + slide vertical.
 */
export default function ProductScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);
  const ovenWrapRef = useRef<HTMLDivElement>(null);
  const featuresWrapRef = useRef<HTMLDivElement>(null);
  const criteriaRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // --- Desktop: 4 estados con scrub ---
      mm.add(
        `(min-width: ${DESKTOP_BP}px)`,
        () => {
          const intro = introRef.current;
          const mainGrid = mainGridRef.current;
          const ovenWrap = ovenWrapRef.current;
          const featuresWrap = featuresWrapRef.current;
          const criteria = criteriaRefs.current.filter(Boolean) as HTMLDivElement[];

          if (!intro || !mainGrid || !ovenWrap || !featuresWrap) return () => {};

          // Estado inicial: texto abajo, horno oculto, grid con columna izquierda cerrada
          gsap.set(intro, { opacity: 0, y: 48 });
          gsap.set(mainGrid, { "--col-left": 0, "--col-right": 100 });
          gsap.set(ovenWrap, { opacity: 0, scale: 0.96 });
          gsap.set(featuresWrap, { opacity: 0, x: -16 });
          gsap.set(criteria, { opacity: 0, x: -8 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${PIN_SCROLL_LENGTH}`,
              scrub: 1.2,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
            },
          });

          // Estado 1: texto entra (fade + slide desde abajo)
          tl.to(intro, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
          // Estado 2: texto sube muy poco para no quedar bajo el navbar
          tl.to(
            intro,
            { y: -Math.min(12, NAVBAR_OFFSET_PX - 64), duration: 0.2, ease: "power2.inOut" },
            0.2
          );
          // Estado 3: imagen del horno aparece (fade + scale; escala algo mayor para protagonismo)
          tl.to(ovenWrap, { opacity: 1, scale: 1.08, duration: 0.22, ease: "power2.out" }, 0.42);
          // Estado 4: columnas más próximas (55% / 45% y menos gap), características con poco x
          tl.to(
            mainGrid,
            {
              "--col-left": 42,
              "--col-right": 58,
              duration: 0.28,
              ease: "power2.inOut",
            },
            0.58
          );
          tl.to(
            featuresWrap,
            { opacity: 1, x: 0, duration: 0.2, ease: "power2.out" },
            0.6
          );
          tl.to(
            criteria,
            { opacity: 1, x: 0, duration: 0.18, stagger: 0.06, ease: "power2.out" },
            0.64
          );

          return () => tl.scrollTrigger?.kill();
        }
      );

      // --- Mobile: columna, solo fade + slide vertical, sin movimientos laterales ---
      mm.add(`(max-width: ${DESKTOP_BP - 1}px)`, () => {
        const intro = introRef.current;
        const ovenWrap = ovenWrapRef.current;
        const featuresWrap = featuresWrapRef.current;
        const criteria = criteriaRefs.current.filter(Boolean) as HTMLDivElement[];

        if (!intro || !ovenWrap || !featuresWrap) return () => {};

        gsap.set(intro, { opacity: 0, y: 32 });
        gsap.set(ovenWrap, { opacity: 0, y: 24 });
        gsap.set(featuresWrap, { opacity: 0, y: 24 });
        gsap.set(criteria, { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${Math.min(PIN_SCROLL_LENGTH, 2400)}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        tl.to(intro, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" });
        tl.to(ovenWrap, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.15);
        tl.to(featuresWrap, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.32);
        tl.to(
          criteria,
          { opacity: 1, y: 0, duration: 0.18, stagger: 0.08, ease: "power2.out" },
          0.38
        );

        return () => tl.scrollTrigger?.kill();
      });
    }, section);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      id="producto"
      ref={sectionRef}
      className="relative min-h-screen bg-industrial-black"
      aria-label="Producto - narrativa por scroll"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-screen w-full flex-col overflow-hidden bg-industrial-black md:min-h-screen"
      >
        {/* Desktop: grid con zonas claras. Mobile: columna. */}
        <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-rows-[auto_1fr] md:grid-cols-1">
          {/* Zona superior: texto (estados 1–2). En desktop tiene su franja; en mobile va primero en la columna. */}
          <div
            ref={introRef}
            className="flex shrink-0 flex-col items-center justify-center px-6 pt-16 pb-8 md:justify-center md:px-12 md:pt-[var(--product-intro-top,5rem)] md:pb-6"
            style={
              { "--product-intro-top": `${NAVBAR_OFFSET_PX}px` } as React.CSSProperties &
                { "--product-intro-top"?: string }
            }
          >
            <div className="w-full max-w-2xl text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-industrial-silver">
                El producto
              </p>
              <p className="mb-3 text-lg font-medium uppercase tracking-widest text-industrial-accent md:text-xl">
                Pensado para la industria
              </p>
              <p className="text-sm leading-relaxed text-industrial-silver/90 md:text-base">
                Cada decisión de diseño responde a una necesidad operativa real.
              </p>
            </div>
          </div>

          {/* Zona principal: en desktop = 2 columnas (features | horno); en mobile = columna (imagen, luego características). */}
          <div
            ref={mainGridRef}
            className="relative flex min-h-0 flex-1 flex-col md:grid md:min-h-0 md:gap-6 md:px-10 md:pb-20"
            style={
              {
                "--col-left": 0,
                "--col-right": 100,
                gridTemplateColumns:
                  "calc(var(--col-left, 0) * 1%) calc(var(--col-right, 100) * 1%)",
              } as React.CSSProperties & { "--col-left"?: number; "--col-right"?: number }
            }
          >
            {/* Columna izquierda: características (desktop). En state 4 la columna pasa a 1fr. */}
            <div
              ref={featuresWrapRef}
              className="order-2 flex min-h-0 flex-col justify-center overflow-hidden px-6 pb-16 md:order-1 md:min-h-0 md:overflow-visible md:px-0 md:pb-0"
            >
              <div className="mx-auto grid w-full max-w-md gap-6 md:mx-0">
                {DESIGN_CRITERIA.map((item, i) => (
                  <div
                    key={item.title}
                    ref={(el) => {
                      criteriaRefs.current[i] = el;
                    }}
                    className="rounded-lg border border-industrial-steel/50 bg-industrial-charcoal/40 px-5 py-4 backdrop-blur-sm"
                  >
                    <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-industrial-silver/90">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: imagen del horno (desktop). En mobile va antes que las características (order). */}
            <div
              ref={ovenWrapRef}
              className="order-1 flex min-h-0 flex-1 items-center justify-center px-4 py-8 md:order-2 md:min-h-0 md:py-12"
            >
              <div className="relative h-[50vh] w-full max-w-xl md:h-full md:min-h-[400px] md:max-w-3xl">
                <Image
                  src={OVEN_IMAGE_SRC}
                  alt="Horno industrial Bellini"
                  fill
                  className="object-contain object-center drop-shadow-2xl"
                  sizes="(max-width: 768px) 90vw, 50vw"
                  priority
                  style={{
                    boxShadow:
                      "0 0 80px rgba(0,0,0,0.8), 0 0 120px rgba(201,162,39,0.08)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
