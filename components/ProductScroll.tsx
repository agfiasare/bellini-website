"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ================= CONFIGURACIÓN ================= */

/** Imagen del producto */
const OVEN_IMAGE_SRC = "/images/assets/Bellini_hornoprincipal.png";

/**
 * Offset vertical BASE del bloque producto.
 * 👉 Mueve horno + features juntos.
 */
const PRODUCT_BLOCK_OFFSET_Y = 64; // px

/**
 * Offset vertical EXTRA SOLO para las características.
 * 👉 ESTE es el que tenés que tocar ahora.
 */
const FEATURES_OFFSET_Y = 48; // px  ← AJUSTÁ ESTE VALOR

/** Duración total del pin */
const PIN_SCROLL_LENGTH = 1200;

/** Breakpoint desktop */
const DESKTOP_BP = 768;

/** Altura reservada para el navbar */
const NAVBAR_OFFSET = 80;

/* ================= DATA ================= */

const DESIGN_CRITERIA = [
  {
    title: "Estabilidad térmica",
    description:
      "Distribución homogénea de temperatura y control preciso para resultados repetibles.",
  },
  {
    title: "Robustez estructural",
    description:
      "Estructura pensada para operación continua y larga vida útil en planta.",
  },
  {
    title: "Operación confiable",
    description:
      "Diseño que prioriza mantenimiento predecible y bajo impacto operativo.",
  },
];

export default function ProductScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const ovenRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const criteriaRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ================= DESKTOP ================= */
      mm.add(`(min-width: ${DESKTOP_BP}px)`, () => {
        gsap.set(introRef.current, { opacity: 0 });
        gsap.set(ovenRef.current, { opacity: 0, x: 0 });
        gsap.set(featuresRef.current, { opacity: 0, x: -24 });
        gsap.set(criteriaRefs.current, { opacity: 0, x: -12 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${PIN_SCROLL_LENGTH}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
          },
        });

        // 1️⃣ Texto
        tl.to(introRef.current, { opacity: 1, duration: 0.25 });

        // 2️⃣ Horno centrado
        tl.to(
          ovenRef.current,
          { opacity: 1, duration: 0.3, ease: "power2.out" },
          0.25
        );

        // 3️⃣ Horno se desplaza a la derecha (solo X)
        tl.to(
          ovenRef.current,
          { x: "25vw", duration: 0.45, ease: "power2.inOut" },
          0.6
        );

        // 4️⃣ Características
        tl.to(
          featuresRef.current,
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
          0.65
        );
        tl.to(
          criteriaRefs.current,
          { opacity: 1, x: 0, stagger: 0.08, duration: 0.25 },
          0.7
        );

        return () => tl.kill();
      });

      /* ================= MOBILE ================= */
      mm.add(`(max-width: ${DESKTOP_BP - 1}px)`, () => {
        gsap.set([introRef.current, ovenRef.current, featuresRef.current], {
          opacity: 0,
        });
        gsap.set(criteriaRefs.current, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=800",
            scrub: 0.4,
            pin: true,
          },
        });

        tl.to(introRef.current, { opacity: 1 });
        tl.to(ovenRef.current, { opacity: 1 }, 0.2);
        tl.to(featuresRef.current, { opacity: 1 }, 0.35);
        tl.to(criteriaRefs.current, { opacity: 1, stagger: 0.1 }, 0.4);

        return () => tl.kill();
      });
    }, section);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="producto"
      className="relative min-h-screen bg-black"
    >
      <div className="relative min-h-screen overflow-hidden">
        {/* ================= TEXTO ================= */}
        <div
          ref={introRef}
          className="relative z-10 flex justify-center px-6 pt-20"
          style={{ paddingTop: NAVBAR_OFFSET }}
        >
          <div className="max-w-2xl text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gray-400">
              El producto
            </p>
            <h2 className="mb-3 text-xl uppercase tracking-widest text-yellow-400">
              Pensado para la industria
            </h2>
            <p className="text-gray-300">
              Cada decisión de diseño responde a una necesidad operativa real.
            </p>
          </div>
        </div>

        {/* ================= HORNO ================= */}
        <div
          ref={ovenRef}
          className="absolute inset-x-0 flex justify-center pointer-events-none"
          style={{
            top: `calc(50% + ${PRODUCT_BLOCK_OFFSET_Y}px)`,
            transform: "translateY(-50%)",
          }}
        >
          <div className="relative h-[60vh] w-[90vw] max-w-[36rem]">
            <Image
              src={OVEN_IMAGE_SRC}
              alt="Horno industrial Bellini"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* ================= CARACTERÍSTICAS ================= */}
        <div
          ref={featuresRef}
          className="
            relative z-10 mt-[60vh]
            flex justify-center px-6 pb-24
            md:mt-0 md:absolute md:left-12
            md:-translate-y-1/2
          "
          style={{
            top: `calc(50% + ${PRODUCT_BLOCK_OFFSET_Y + FEATURES_OFFSET_Y}px)`,
          }}
        >
          <div className="grid max-w-md gap-6">
            {DESIGN_CRITERIA.map((item, i) => (
              <div
                key={item.title}
                ref={(el) => { criteriaRefs.current[i] = el; }}
                className="rounded-lg border border-gray-700 bg-gray-900/60 px-5 py-4"
              >
                <h3 className="mb-2 text-sm uppercase tracking-wide text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
