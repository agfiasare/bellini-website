"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Secuencia 360°: imágenes en public/images/oven-360/ (todas .png).
 * Orden invertido para coincidir con el estándar Serie Pro (vista de referencia).
 */
const OVEN_360_BASE = "/images/oven-360/";
const FRAME_SOURCES: string[] = [
  OVEN_360_BASE + "oven_011.png",
  OVEN_360_BASE + "oven_010.png",
  OVEN_360_BASE + "oven_009.png",
  OVEN_360_BASE + "oven_008.png",
  OVEN_360_BASE + "oven_007.png",
  OVEN_360_BASE + "oven_006.png",
  OVEN_360_BASE + "oven_005.png",
  OVEN_360_BASE + "oven_004.png",
  OVEN_360_BASE + "oven_003.png",
  OVEN_360_BASE + "oven_002.png",
  OVEN_360_BASE + "oven_001.png",
];
const FRAME_COUNT = FRAME_SOURCES.length;
/** Fallback si alguna imagen no carga: 1 imagen + rotateY o placeholder. */
const FALLBACK_SINGLE_IMAGE = "/images/oven-360/oven.svg";

/** Criterios de diseño: título + descripción técnica (1–2 líneas) */
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

/**
 * Bloque de producto: primero visual, después explicativo.
 * - Fase visual: solo el horno en 360°, título "El producto" que se desvanece al rotar
 * - Ancla: horno vuelve a frontal y se bloquea
 * - Fase explicativa: criterios de diseño (Pensado para la industria) con stagger
 */
export default function ProductScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [useSingleImageFallback, setUseSingleImageFallback] = useState(false);
  const phaseVisualRef = useRef<HTMLDivElement>(null);
  const phaseExplainRef = useRef<HTMLDivElement>(null);
  const criteriaCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !canvasRef.current) return;

    const totalScrollLength = 2000; // longitud "virtual" del scroll para el acto 1 (360°)
    let frameIndex = 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalScrollLength + 800}`, // scroll total del bloque (360 + ancla + features)
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // --- ACTO 1: Rotación 360° ---
      // Scroll 0 .. totalScrollLength controla el frame (0 .. FRAME_COUNT-1)
      // --- ACTO 2: Al completar 360°, ancla en frame 0 (posición frontal)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalScrollLength}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const index =
            progress >= 1
              ? 0
              : Math.min(
                  Math.floor(progress * FRAME_COUNT),
                  FRAME_COUNT - 1
                );
          if (index !== frameIndex) {
            frameIndex = index;
            setCurrentFrame(index);
          }
        },
      });

      // --- Fase visual: título "El producto" visible al inicio, se desvanece al avanzar la rotación ---
      if (phaseVisualRef.current) {
        gsap.set(phaseVisualRef.current, { opacity: 1 });
        tl.to(
          phaseVisualRef.current,
          { opacity: 0, duration: 0.8, ease: "power2.in" },
          0.15
        );
      }

      // --- Fase explicativa: criterios de diseño tras anclar el horno ---
      if (phaseExplainRef.current) {
        gsap.set(phaseExplainRef.current, { opacity: 0, y: 12 });
        tl.to(
          phaseExplainRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.68
        );
      }
      if (criteriaCardsRef.current.length) {
        gsap.set(criteriaCardsRef.current, { opacity: 0, y: 24 });
        tl.to(
          criteriaCardsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
          },
          0.72
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="producto"
      ref={sectionRef}
      className="relative bg-industrial-black"
      aria-label="Producto protagonista - rotación y características"
    >
      <div ref={pinRef} className="relative h-screen w-full">
        {/* Contenedor del horno — iluminación dramática con sombras */}
        <div
          ref={canvasRef}
          className="absolute inset-0 flex items-center justify-center bg-industrial-black"
        >
          <div className="relative h-[70vh] w-full max-w-4xl flex items-center justify-center">
            <div className="relative aspect-square max-h-full w-full flex items-center justify-center [perspective:1000px]">
              {useSingleImageFallback ? (
                <div
                  className="flex max-h-full w-auto items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${currentFrame * (360 / FRAME_COUNT)}deg)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FALLBACK_SINGLE_IMAGE}
                    alt="Horno industrial"
                    className="max-h-full w-auto object-contain drop-shadow-2xl"
                    style={{
                      boxShadow:
                        "0 0 80px rgba(0,0,0,0.8), 0 0 120px rgba(201,162,39,0.08)",
                    }}
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = "none";
                      const wrap = t.parentElement;
                      if (!wrap?.querySelector(".oven-placeholder")) {
                        const ph = document.createElement("div");
                        ph.className =
                          "oven-placeholder flex h-48 w-64 items-center justify-center rounded-lg border border-industrial-steel bg-industrial-charcoal text-industrial-silver";
                        ph.textContent = "Horno industrial";
                        wrap?.appendChild(ph);
                      }
                    }}
                  />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={currentFrame}
                  src={FRAME_SOURCES[currentFrame]}
                  alt={`Vista del horno industrial, ángulo ${currentFrame + 1}`}
                  className="max-h-full w-auto object-contain drop-shadow-2xl pb-12"
                  style={{
                    boxShadow:
                      "0 0 80px rgba(0,0,0,0.8), 0 0 120px rgba(201,162,39,0.08)",
                  }}
                  onError={() => setUseSingleImageFallback(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Fase visual: solo el título, sin explicación — "primero lo ves" */}
        <div
          ref={phaseVisualRef}
          className="absolute top-0 left-0 right-0 z-10 pt-16 text-center md:pt-20"
        >
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-industrial-silver">
            El producto
          </p>
        </div>

        {/* Texto encuadre: centrado en la página, arriba sobre la imagen del horno */}
        <div className="absolute left-0 right-0 top-24 z-10 px-6 md:top-28 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-lg font-medium uppercase tracking-widest text-industrial-accent">
              Pensado para la industria
            </p>
            <p className="text-sm leading-relaxed text-industrial-silver/90">
              Cada decisión de diseño responde a una necesidad operativa real.
            </p>
          </div>
        </div>

        {/* Fase explicativa: solo las 3 cards de criterios de diseño */}
        <div
          ref={phaseExplainRef}
          className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-20 pt-8 opacity-0 md:px-12 md:pb-24"
        >
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 sm:grid-cols-3">
              {DESIGN_CRITERIA.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    criteriaCardsRef.current[i] = el;
                  }}
                  className="rounded-lg border border-industrial-steel/50 bg-industrial-charcoal/40 px-5 py-4 opacity-0 backdrop-blur-sm"
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
        </div>
      </div>
    </section>
  );
}
